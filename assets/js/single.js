var issueContainerEl = document.getElementById("issues-container");
var limitWarningEl = document.getElementById("limit-warning");
var repoNameEl = document.getElementById("repo-name");

var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // HTTP request to hit this endpoint and check the information returned in the response
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            // redirect back to homepage if repoName isn't valid
            document.location.replace("./index.html");
        }
    });
}

var getRepoName =  function () {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if (repoName) {
        // display repo name on the page and pass repoName variable to getRepoIssues function
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else {
        // redirect back to homepage if repoName isn't valid
        document.location.replace("./index.html");
    }
}

var displayIssues =  function (issues) {
    // check if no open issues and display message
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on GitHub
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        // append to container
        issueEl.appendChild(titleEl);
        // create a span to hold issue type
        var typeEl = document.createElement("span");
        // check if issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        // append to container
        issueEl.appendChild(typeEl);
    }

    issueContainerEl.appendChild(issueEl);
}

var displayWarning = function (repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit :";
    // create link
    var linkEl = createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href","https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target","_blank");
    // append to warning container
    limitWarningEl.appendChild(linkEl);
}


getRepoName();