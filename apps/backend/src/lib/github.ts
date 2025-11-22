export async function fetchUserRepos(accessToken: string) {
  const response = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=updated",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch repos from Github");
  }

  const repos = (await response.json()) as Array<{
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
    private: boolean;
  }>;

  return repos.map((repo) => ({
    githubId: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
  }));
}

export async function fetchPullRequests(
  accessToken: string,
  owner: string,
  repo: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch PRs for ${owner}/${repo}`);
  }

  const prs = (await response.json()) as Array<{
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    merged_at: string | null;
    closed_at: string | null;
  }>;

  return prs.map((pr) => ({
    githubId: pr.id,
    number: pr.number,
    title: pr.title,
    state: pr.state,
    url: pr.html_url,
    createdAt: new Date(pr.created_at),
    updatedAt: new Date(pr.updated_at),
    mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
    closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
  }));
}
