export class CreatePostDto {
  title: string;
  content: string;
  authorId: number;
}

export class UpdatePostDto  {
  title?: string;
  content?: string;
  authorId?: number;
}
