import { fetchJson, fetchJsonAllPages } from './utils/fetch';
import { RawRepository } from './types/api';
import { logAction } from './utils/logAction';

export interface Repository {
  name: string;
  description: null | string;
  tech: string[];
  stars: number;
  url: string;
  website: null | string;
}

export interface Data {
  repositories: Repository[];
}

const githubRequestOptions = {
  headers: [
    ['Accept', 'application/vnd.github.v3+json'],
    ['Authorization', `token ${process.env.GITHUB_TOKEN}`]
  ]
};

export async function fetchRepositories(): Promise<Repository[]> {
  const data = await fetchJsonAllPages<RawRepository[]>(
    `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
    githubRequestOptions
  );
  if (Array.isArray(data)) {
    const repositories: Repository[] = [];
    for (let i = 0; i < data.length; i++) {
      const repository = data[i];
      type TechObj = {
        [key: string]: string;
      };

      const tech: TechObj = {};
      const packageJson = await fetchJson<any>(
        `${repository.contents_url.replace(/{\+path}$/, '')}package.json`,
        githubRequestOptions
      );

      try {
        const languages = await fetchJson<TechObj>(repository.languages_url, githubRequestOptions);
        for (const key in languages) {
          if (languages.hasOwnProperty(key)) {
            switch (key) {
              case 'Dockerfile':
                tech['docker'] = 'docker';
                break;

              default:
                tech[key.toLowerCase()] = key.toLowerCase();
                break;
            }
          }
        }
      } catch (e) {
        logAction('ERR:db:1', e);
      }

      try {
        if (packageJson) {
          const packageData = JSON.parse(
            Buffer.alloc(packageJson.size, packageJson.content, 'base64').toString('ascii')
          );

          const deps = { ...packageData.dependencies, ...packageData.devDependencies };
          for (const key in deps) {
            switch (key) {
              case 'typescript':
              case 'webpack':
              case 'vue':
              case 'react':
              case 'jest':
              case 'electron':
              case 'docker':
                tech[key] = key;
                break;
              case '@angular/core':
                tech['angular'] = 'angular';
                break;
              case '@babel/core':
                tech['babel'] = 'babel';
                break;
              case 'node-sass':
              case 'sass':
                tech['sass'] = 'sass';
                break;
            }
          }
        }
      } catch (e) {
        logAction('ERR:db:2', e);
      }

      repositories.push({
        stars: repository.stargazers_count,
        name: repository.name,
        url: repository.html_url,
        description: repository.description,
        website: repository.homepage,
        tech: Object.values(tech)
      });
    }
    return repositories; // .sort((a, b) => b.stars - a.stars);
  }
  return [];
}
