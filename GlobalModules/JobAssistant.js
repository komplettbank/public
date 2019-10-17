/* ================================================================================== */
/*
/*  Utility with functions for inspecting longrunning jobs. It can be loaded and used in 
/*  test-scripts, for example like this:
/*
/*      let util = eval(pm.globals.get("module:JobAssistant"));
/*      util.checkJobStatus("https://<insert_url_to_jobs_api>/jobs/cd733e56-36d7-d29c-40f1-64fdf06925fc);
/*
/* ================================================================================== */

function JobAssistant() {

    let _module = {};

    /* ==================== Public methods ================== */

    /*
        Repeatedly checks the status of a job, either until it is finished, or until the maximum number of
        checks has been reached. 
        Parameters:
            url                     = The url to call in order to check the status of the job.
            secondsBetweenChecks    = The number of seconds to wait between each check. Default value is 10.
            maxNumberOfChecks       = The number of retries before giving up waiting for the job to finish. Default value is 10.
            maxNumberOf404          = The number of retries before giving up waiting for the job to start. Default is 3. 
                                      Note: When a job is first triggered, the endpoint will return 404 until the job is actually picked up by NServiceBus.
    */
    _module.checkJobStatus = (url, secondsBetweenChecks, maxNumberOfChecks, maxNumberOf404) => {

        secondsBetweenChecks = secondsBetweenChecks || 10;
        maxNumberOfChecks = maxNumberOfChecks || 10;
        maxNumberOf404 = maxNumberOf404 || 3;

        let jobStatus = "";
        let doneStatus = "Finished";
        let count = 0;
        let count404 = 0;

        let poll = () => {
            if (count >= maxNumberOfChecks) {
                console.warn("Job still not finished, after " + count + " tries in " + secondsBetweenChecks * count + " seconds. Giving up...");
                console.warn("Skipping the rest of the collection.");
                pm.test("Job finished within " + maxNumberOfChecks + " tries", () => { pm.expect(count).to.be.below(maxNumberOfChecks); });
                postman.setNextRequest(null);
                clearInterval(startPoll);
            }

            count++;

            pm.sendRequest({
                url: url,
                method: 'GET',
                header: {
                    "Ocp-Apim-Subscription-Key": pm.environment.get("jobsApi.subscriptionKey")
                }
            }, (err, res) => {
                if (err) {
                    console.log("Unexpected error when checking job progress");
                    console.log(err);
                    pm.test("No errors encountered when checking job progress", () => { pm.expect(err).to.be.null; });
                    clearInterval(startPoll);
                } else if (res.code === 404) {
                    count404++;
                    if (count404 >= maxNumberOf404) {
                        console.warn("Job still not started, after " + count404 + " tries in " + secondsBetweenChecks * count + " seconds. Giving up...");
                        console.warn("Skipping the rest of the collection.");
                        pm.test("Job started within " + maxNumberOf404 + " tries", () => { pm.expect(count404).to.be.below(maxNumberOf404); });
                        postman.setNextRequest(null);
                        clearInterval(startPoll);
                    } else {
                        console.log(count404 + ". 404. Waiting for the job to start...");
                    }
                } else if (res.code !== 200) {
                    console.log("Unexpected response code when checking job progress. Got " + res.code + ", but expected 200.");
                    pm.test("Status code is 200 when checking job progress", () => { pm.expect(res.code).to.equal(200); });
                    clearInterval(startPoll);
                } else {
                    let resJson = {};
                    try { resJson = res.json(); }
                    catch (e) {
                        console.log("Failed to convert response to json when checking job progress: " + e);
                        pm.test("Response can be converted to json when checking job progress", () => { pm.expect(e).to.be.null; });
                        clearInterval(startPoll);
                    }

                    jobStatus = resJson.status;
                    console.log("Check " + count + ". Status=" + jobStatus);
                    console.log("Response: " + JSON.stringify(resJson));
                    if (jobStatus === doneStatus) {
                        pm.test("The job finished successfully", () => { pm.expect(jobStatus).to.equal(doneStatus); });
                        if (resJson.statusMessage === "Import finished with zero downloaded invoice files") {
                            console.log("Stopping run because no files was downloaded");
                            postman.setNextRequest(null);
                        }
                        clearInterval(startPoll);
                    }
                }
            });
        };

        console.log("Waiting for the job to start. Will check job status every " + secondsBetweenChecks + " seconds (up to " + maxNumberOfChecks + " times)...");
        let startPoll = setInterval(poll, secondsBetweenChecks * 1000);

        // Waiting before checking job progress
        setTimeout(function () { }, secondsBetweenChecks * 1000);
    };

    /* ==================== Private methods ================== */

    return _module;
}; JobAssistant();
