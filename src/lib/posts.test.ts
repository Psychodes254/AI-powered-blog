import { getSortedPostsData, getPostData, getAllPostIds } from './posts';
import fs from 'fs';

jest.mock('fs');

describe('posts lib', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSortedPostsData', () => {
    it('should return sorted posts data', () => {
      const mockFileNames = ['post2.md', 'post1.md'];
      const mockPost1 = '---\ntitle: Post 1\ndate: 2023-01-01\n---\n\nContent 1';
      const mockPost2 = '---\ntitle: Post 2\ndate: 2023-01-02\n---\n\nContent 2';

      (fs.readdirSync as jest.Mock).mockReturnValue(mockFileNames);
      (fs.readFileSync as jest.Mock).mockImplementation((path) => {
        if (path.endsWith('post1.md')) {
          return mockPost1;
        }
        if (path.endsWith('post2.md')) {
          return mockPost2;
        }
        return '';
      });

      const posts = getSortedPostsData();

      expect(posts).toEqual([
        { id: 'post2', title: 'Post 2', date: '2023-01-02' },
        { id: 'post1', title: 'Post 1', date: '2023-01-01' },
      ]);
    });
  });

  describe('getPostData', () => {
    it('should return post data for a given id', async () => {
      const mockPost = '---\ntitle: Test Post\ndate: 2023-01-01\n---\n\n# Hello';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockPost);

      const postData = await getPostData('test-post');

      expect(postData.title).toBe('Test Post');
      expect(postData.date).toBe('2023-01-01');
      expect(postData.contentHtml).toContain('<h1>Hello</h1>');
    });
  });

  describe('getAllPostIds', () => {
    it('should return all post ids', () => {
      const mockFileNames = ['post1.md', 'post2.md'];
      (fs.readdirSync as jest.Mock).mockReturnValue(mockFileNames);

      const postIds = getAllPostIds();

      expect(postIds).toEqual([
        { params: { id: 'post1' } },
        { params: { id: 'post2' } },
      ]);
    });
  });
});
