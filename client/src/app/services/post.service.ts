import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Post } from '../interfaces/Post';
import { PostCount } from '../interfaces/PostCount';
import { FormGroup } from '@angular/forms';
import { PostForm } from '../interfaces/PostForm';
import { env } from '../../environments/environment';
import { PostBody } from '../interfaces/PostBody';
import { PostResponse } from '../interfaces/PostResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = env.apiUrl;
  private postDetailData: Post | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  async getPosts(offset: number, limit: number): Promise<Post[]> {
    return firstValueFrom(this.http.get<Post[]>(`${this.apiUrl}/posts?offset=${offset}&limit=${limit}`));
  }

  async getCount(): Promise<PostCount> {
    return firstValueFrom(this.http.get<PostCount>(`${this.apiUrl}/posts/count`));
  }

  async getPostById(postId: string): Promise<PostResponse> {
    return firstValueFrom(this.http.get<PostResponse>(`${this.apiUrl}/posts/${postId}`));
  }

  async createPost(postData: PostBody): Promise<Post> {
    return firstValueFrom(this.http.post<Post>(`${this.apiUrl}/posts`, postData));
  }

  setPostDetailData(post: Post): void {
    this.postDetailData = post;
  }

  getPostDetailData(): Post | undefined {
    return this.postDetailData;
  }

  private isUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  inPostDetailPage(): boolean {
    const routerUrl = this.router.url;
    const isPostState = routerUrl.includes('post');
    const stateList = routerUrl.split('/');
    return isPostState && this.isUUID(stateList[stateList.length-1]);
  }
}
