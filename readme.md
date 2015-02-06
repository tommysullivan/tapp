This is an attempt to map out a URL space and come up with representations of the resources that link together to
create a logical map of what is happening during CICD.

Once we understand what these initial representations look like for a limited use case, we can canonicalize the
media types for each representation and build systems off of those media types. Later, we might create new
representation types for more complex scenarios and expand on the media types while keeping the resource URI structure
logically the same; we might also decide there are entirely different concepts and create new resources in new locations.

We can host these resources across one or many web servers and use href to link between resources.