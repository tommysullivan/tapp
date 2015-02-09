pa-portal / CICD proof of concept
---------------------------------

This is a POC to try and flesh out the logical REST resources that compose the overall solution, which will be
spread across multiple servers owned by different teams.

The following guiding principles are suggested:
https://confluence.corp.lookout.com/pages/viewpage.action?title=Platform+Automation&spaceKey=eng#PlatformAutomation-principles

# General workflow (note that caching of all resources via ETAG would reduce unnecessary http traffic)

1. Navigate to cicd/components to list, find, view, add, update or delete components
2. Create or delete a deployment webhook for desired components
3. Receive a deployment-notification when the hooked component is deployed, along with the href of the deployment
4. The notification contains callback hrefs for progress, error, completion and other events
5. GET the deployment record using the content-type and version that is understood by PA (there may be other formats over time)
6. Understand the deployed artifact(s) and the target environment(s)
7. On our side, kick off the tests. The nature of the tests will determine what inputs we need to run them.
    a. Host names, URLs, credentials used may vary based on environment
    b. Feature branch development may occur in which case we may need a branched version of the test definitions / artifacts
    c. Running subsets of the tests may involve calling via tags, etc.
8. Use the event hooks provided in the deployment-notification to update the calling system with progress / completion updates
9. Write results to CQM using the deployment url / artifacts, etc