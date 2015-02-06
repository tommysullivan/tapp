/*
Workflow:

1. POST to test-runs would contain a payload with only a small amount of info - the url of the deployment
    a. This would create a new resource, and the response would be the HTTP location redirect to the new resource
    b. This new resource can be GET'd at any time to see progress of the test run
    c. We can also POST updates about status as a web hook back
2. GET the href of the deployment from (1)
3. We can check the status property of (2) and begin preparing the tests even when deployment is not yet ready if we choose
4. GET the deployment item and figure out the type of artifact, the component, the location of the artifact, etc.
5. GET the environment so we can understand where the artifact was deployed
6. Determine what are all the integration tests that should run
    a. The artifact / source of the deployed item itself could store this information
    b. Alternatively, we could search the dependency graph of things that consume the deployed artifact that are themselves
        deployed to an environment that consumes the deployed item in its environment.
        i. If we do this then we know all the things that could be implicated
        ii. We could potentially kick off all of the integration tests for each of these products
        iii. We could pass parameters to each of these tests so that they run only a subset that is associated with the deployed item
        iv. Either way we need to know what components are implicated and then where the tests for that component are
            * they could be in the source of the component
            * they could be in a separate repository
7. We can then kick off a job that can in turn run a bunch of jobs with all the integration tests
8. Each job would be passed the deployment URL that triggered it plus potentially additional URLs / data that the test runner would
    consume in order to execute the tests in the right context and against the right environment.
9. The job would produce results that would become build artifacts
10. The CQM client would then send the test result artifacts to the PA portal which in turn would store them in elasticsearch
11. The portal would know what to expect in terms of results and eventually update the status of the test-run record


 */