import { PushEvent } from "../lambda/types";

export const VALID_PUSH_PAYLOAD_USER_REPO: PushEvent = {
  ref: "refs/heads/main",
  before: "448223ee31c525296e09832c0da95559015f500c",
  after: "7119b388e221a96ced5e1dfa0528d51847828308",
  repository: {
    id: 482984142,
    node_id: "R_kgDOHMnAzg",
    name: "github-webhook-proxy",
    full_name: "username_suffix/github-webhook-proxy",
    private: true,
    owner: {
      name: "username_suffix",
      email: "user@ExampleOrg.com",
      login: "username_suffix",
      id: 103291641,
      node_id: "U_kgDOBiga-Q",
      avatar_url: "https://avatars.githubusercontent.com/u/103291641?v=4",
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
      events_url:
        "https://api.github.com/users/username_suffix/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/username_suffix/received_events",
      type: "User",
      site_admin: false,
    },
    html_url: "https://github.com/username_suffix/github-webhook-proxy",
    description: null,
    fork: false,
    url: "https://github.com/username_suffix/github-webhook-proxy",
    forks_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/forks",
    keys_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/keys{/key_id}",
    collaborators_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/collaborators{/collaborator}",
    teams_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/teams",
    hooks_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/hooks",
    issue_events_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/issues/events{/number}",
    events_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/events",
    assignees_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/assignees{/user}",
    branches_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/branches{/branch}",
    tags_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/tags",
    blobs_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/git/blobs{/sha}",
    git_tags_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/git/tags{/sha}",
    git_refs_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/git/refs{/sha}",
    trees_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/git/trees{/sha}",
    statuses_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/statuses/{sha}",
    languages_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/languages",
    stargazers_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/stargazers",
    contributors_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/contributors",
    subscribers_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/subscribers",
    subscription_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/subscription",
    commits_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/commits{/sha}",
    git_commits_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/git/commits{/sha}",
    comments_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/comments{/number}",
    issue_comment_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/issues/comments{/number}",
    contents_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/contents/{+path}",
    compare_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/compare/{base}...{head}",
    merges_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/merges",
    archive_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/{archive_format}{/ref}",
    downloads_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/downloads",
    issues_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/issues{/number}",
    pulls_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/pulls{/number}",
    milestones_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/milestones{/number}",
    notifications_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/notifications{?since,all,participating}",
    labels_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/labels{/name}",
    releases_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/releases{/id}",
    deployments_url:
      "https://api.github.com/repos/username_suffix/github-webhook-proxy/deployments",
    created_at: 1650312935,
    updated_at: "2022-04-19T12:27:56Z",
    pushed_at: 1650489516,
    git_url: "git://github.com/username_suffix/github-webhook-proxy.git",
    ssh_url: "git@github.com:username_suffix/github-webhook-proxy.git",
    clone_url: "https://github.com/username_suffix/github-webhook-proxy.git",
    svn_url: "https://github.com/username_suffix/github-webhook-proxy",
    homepage: null,
    size: 3,
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
    visibility: "private",
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: "main",
    stargazers: 0,
    master_branch: "main",
    has_discussions: false,
  },
  pusher: {
    name: "username_suffix",
    email: "user@ExampleOrg.com",
  },
  sender: {
    login: "username_suffix",
    id: 103291641,
    node_id: "U_kgDOBiga-Q",
    avatar_url: "https://avatars.githubusercontent.com/u/103291641?v=4",
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
  created: false,
  deleted: false,
  forced: false,
  base_ref: null,
  compare:
    "https://github.com/username_suffix/github-webhook-proxy/compare/448223ee31c5...7119b388e221",
  commits: [
    {
      id: "7119b388e221a96ced5e1dfa0528d51847828308",
      tree_id: "e5d86be93b96d8389e85e1e34560e936786e6ec2",
      distinct: true,
      message: "dummy commit",
      timestamp: "2022-04-20T17:18:32-04:00",
      url: "https://github.com/username_suffix/github-webhook-proxy/commit/7119b388e221a96ced5e1dfa0528d51847828308",
      author: {
        name: "user",
        email: "user@ExampleOrg.com",
      },
      committer: {
        name: "user",
        email: "user@ExampleOrg.com",
      },
      added: [],
      removed: [],
      modified: [],
    },
  ],
  head_commit: {
    id: "7119b388e221a96ced5e1dfa0528d51847828308",
    tree_id: "e5d86be93b96d8389e85e1e34560e936786e6ec2",
    distinct: true,
    message: "dummy commit",
    timestamp: "2022-04-20T17:18:32-04:00",
    url: "https://github.com/username_suffix/github-webhook-proxy/commit/7119b388e221a96ced5e1dfa0528d51847828308",
    author: {
      name: "user",
      email: "user@ExampleOrg.com",
    },
    committer: {
      name: "user",
      email: "user@ExampleOrg.com",
    },
    added: [],
    removed: [],
    modified: [],
  },
};
