import { db, Repository } from '../db';
import { RawRepository } from '../types/api';
import { Request, Response } from 'express';
import { error } from './errors';
import { fetchJson } from '../utils/fetch';

export async function handleGetRepositories(req: Request, res: Response) {
  await getRepositories(req, res, 0);
}
async function getRepositories(req: Request, res: Response, tries: number) {
  const repositories = db.get('repositories');
  const repositoriesMeta = db.getInfo('repositories');
  if (
    repositories &&
    repositoriesMeta &&
    (repositoriesMeta.lastChanged || 0) + 1000 * 60 * 60 * 24 >= Date.now()
  ) {
    res.json(repositories);
    return;
  }
  await fetchRepositories();

  res.status(500).send(error(500));
  if (tries && tries >= 2) {
    return;
  }

  // await getRepositories(req, res, tries + 1);
}

const githubRequestOptions = {
  headers: [
    ['Accept', 'application/vnd.github.v3+json'],
    ['Authorization', `token ${process.env.GITHUB_TOKEN}`]
  ]
};

async function fetchRepositories() {
  const data = await fetchJson<RawRepository[]>(
    `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
    githubRequestOptions
  );
  if (Array.isArray(data)) {
    const repositories: Repository[] = [];
    for (let i = 0; i < 1; i++) {
      const repository = data[i];
      const tech: Repository['tech'] = [];
      const packageJson = await fetchJson<any>(
        `${repository.contents_url.replace(/{\+path}$/, '')}package.json`,
        githubRequestOptions
      );
      if (packageJson) {
        const packageData = JSON.parse(
          Buffer.alloc(packageJson.size, packageJson.content, 'base64').toString('ascii')
        );

        const deps = { ...packageData.dependencies, ...packageData.devDependencies };
        console.log(deps);
      }
      repositories.push({
        name: repository.name,
        description: repository.description,
        website: repository.homepage,
        tech
      });
    }
  }
}
