import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3100';
  private postDetailData: any;

  constructor(private http: HttpClient) {}

  async getPosts(offset: number, limit: number) {
    return firstValueFrom(this.http.get(`${this.apiUrl}/posts?offset=${offset}&limit=${limit}`));
  }

  async getPostById(postId: string) {
    return firstValueFrom(this.http.get(`${this.apiUrl}/posts/${postId}`));
  }

  async createPost(postData: any) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/posts`, postData));
  }

  setPostDetailData(post: any) {
    this.postDetailData = post;
  }

  getPostDetailData() {
    return this.postDetailData;
  }
}
