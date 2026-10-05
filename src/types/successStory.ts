export interface SuccessStoryPhoto {
  url: string;
  publicId: string;
}

export interface SuccessStory {
  _id: string;
  shelter: { _id: string; name: string };
  adoptionRequest: string;
  petName: string;
  title: string;
  story: string;
  photos: SuccessStoryPhoto[];
  createdAt: string;
}

export interface SuccessStoriesResponse {
  success: boolean;
  count: number;
  stories: SuccessStory[];
}

export interface SuccessStoryResponse {
  success: boolean;
  story: SuccessStory;
}