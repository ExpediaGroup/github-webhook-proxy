import { PingEvent } from "../lambda/types";

export const VALID_PING_EVENT: PingEvent = {
  zen: "Design for failure.",
  hook_id: 391282347,
  hook: {
    type: "Repository",
    id: 391282347,
    name: "web",
    active: true,
    events: ["push"],
    config: {
      content_type: "json",
      url: "https://approved.host/github-webhook/",
      insecure_ssl: "0",
    },
    updated_at: "2022-12-05T20:28:34Z",
    created_at: "2022-12-05T20:28:34Z",
    url: "https://api.github.com/repos/github-org/github-repo/hooks/391282347",
    test_url:
      "https://api.github.com/repos/github-org/github-repo/hooks/391282347/test",
    ping_url:
      "https://api.github.com/repos/github-org/github-repo/hooks/391282347/pings",
    deliveries_url:
      "https://api.github.com/repos/github-org/github-repo/hooks/391282347/deliveries",
    last_response: {
      code: null,
      status: "unused",
      message: null,
    },
  },
  repository: {
    id: 567006112,
    node_id: "R_kgDOIcvToA",
    name: "github-repo",
    full_name: "github-org/github-repo",
    private: true,
    owner: {
      login: "github-org",
      id: 107203838,
      node_id: "O_kgDOBmPM_g",
      avatar_url: "https://avatars.githubusercontent.com/u/107203838?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/github-org",
      html_url: "https://github.com/github-org",
      followers_url: "https://api.github.com/users/github-org/followers",
      following_url:
        "https://api.github.com/users/github-org/following{/other_user}",
      gists_url: "https://api.github.com/users/github-org/gists{/gist_id}",
      starred_url:
        "https://api.github.com/users/github-org/starred{/owner}{/repo}",
      subscriptions_url:
        "https://api.github.com/users/github-org/subscriptions",
      organizations_url: "https://api.github.com/users/github-org/orgs",
      repos_url: "https://api.github.com/users/github-org/repos",
      events_url: "https://api.github.com/users/github-org/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/github-org/received_events",
      type: "Organization",
      site_admin: false,
    },
    html_url: "https://github.com/github-org/github-repo",
    description: null,
    fork: false,
    url: "https://api.github.com/repos/github-org/github-repo",
    forks_url: "https://api.github.com/repos/github-org/github-repo/forks",
    keys_url:
      "https://api.github.com/repos/github-org/github-repo/keys{/key_id}",
    collaborators_url:
      "https://api.github.com/repos/github-org/github-repo/collaborators{/collaborator}",
    teams_url: "https://api.github.com/repos/github-org/github-repo/teams",
    hooks_url: "https://api.github.com/repos/github-org/github-repo/hooks",
    issue_events_url:
      "https://api.github.com/repos/github-org/github-repo/issues/events{/number}",
    events_url: "https://api.github.com/repos/github-org/github-repo/events",
    assignees_url:
      "https://api.github.com/repos/github-org/github-repo/assignees{/user}",
    branches_url:
      "https://api.github.com/repos/github-org/github-repo/branches{/branch}",
    tags_url: "https://api.github.com/repos/github-org/github-repo/tags",
    blobs_url:
      "https://api.github.com/repos/github-org/github-repo/git/blobs{/sha}",
    git_tags_url:
      "https://api.github.com/repos/github-org/github-repo/git/tags{/sha}",
    git_refs_url:
      "https://api.github.com/repos/github-org/github-repo/git/refs{/sha}",
    trees_url:
      "https://api.github.com/repos/github-org/github-repo/git/trees{/sha}",
    statuses_url:
      "https://api.github.com/repos/github-org/github-repo/statuses/{sha}",
    languages_url:
      "https://api.github.com/repos/github-org/github-repo/languages",
    stargazers_url:
      "https://api.github.com/repos/github-org/github-repo/stargazers",
    contributors_url:
      "https://api.github.com/repos/github-org/github-repo/contributors",
    subscribers_url:
      "https://api.github.com/repos/github-org/github-repo/subscribers",
    subscription_url:
      "https://api.github.com/repos/github-org/github-repo/subscription",
    commits_url:
      "https://api.github.com/repos/github-org/github-repo/commits{/sha}",
    git_commits_url:
      "https://api.github.com/repos/github-org/github-repo/git/commits{/sha}",
    comments_url:
      "https://api.github.com/repos/github-org/github-repo/comments{/number}",
    issue_comment_url:
      "https://api.github.com/repos/github-org/github-repo/issues/comments{/number}",
    contents_url:
      "https://api.github.com/repos/github-org/github-repo/contents/{+path}",
    compare_url:
      "https://api.github.com/repos/github-org/github-repo/compare/{base}...{head}",
    merges_url: "https://api.github.com/repos/github-org/github-repo/merges",
    archive_url:
      "https://api.github.com/repos/github-org/github-repo/{archive_format}{/ref}",
    downloads_url:
      "https://api.github.com/repos/github-org/github-repo/downloads",
    issues_url:
      "https://api.github.com/repos/github-org/github-repo/issues{/number}",
    pulls_url:
      "https://api.github.com/repos/github-org/github-repo/pulls{/number}",
    milestones_url:
      "https://api.github.com/repos/github-org/github-repo/milestones{/number}",
    notifications_url:
      "https://api.github.com/repos/github-org/github-repo/notifications{?since,all,participating}",
    labels_url:
      "https://api.github.com/repos/github-org/github-repo/labels{/name}",
    releases_url:
      "https://api.github.com/repos/github-org/github-repo/releases{/id}",
    deployments_url:
      "https://api.github.com/repos/github-org/github-repo/deployments",
    created_at: "2022-11-16T21:46:21Z",
    updated_at: "2022-11-16T21:46:21Z",
    pushed_at: "2022-12-05T19:36:08Z",
    git_url: "git://github.com/github-org/github-repo.git",
    ssh_url: "git@github.com:github-org/github-repo.git",
    clone_url: "https://github.com/github-org/github-repo.git",
    svn_url: "https://github.com/github-org/github-repo",
    homepage: null,
    size: 25,
    stargazers_count: 0,
    watchers_count: 0,
    language: null,
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: null,
    allow_forking: true,
    is_template: false,
    web_commit_signoff_required: false,
    topics: [],
    visibility: "internal",
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: "main",
  },
  sender: {
    login: "username_suffix",
    id: 118491937,
    node_id: "U_kgDOBxALIQ",
    avatar_url: "https://avatars.githubusercontent.com/u/118491937?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/username_suffix",
    html_url: "https://github.com/username_suffix",
    followers_url: "https://api.github.com/users/username_suffix/followers",
    following_url:
      "https://api.github.com/users/username_suffix/following{/other_user}",
    gists_url: "https://api.github.com/users/username_suffix/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/username_suffix/starred{/owner}{/repo}",
    subscriptions_url:
      "https://api.github.com/users/username_suffix/subscriptions",
    organizations_url: "https://api.github.com/users/username_suffix/orgs",
    repos_url: "https://api.github.com/users/username_suffix/repos",
    events_url: "https://api.github.com/users/username_suffix/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/username_suffix/received_events",
    type: "User",
    site_admin: false,
  },
};
