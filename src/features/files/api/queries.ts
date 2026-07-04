import { useMutation } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type { FileResponse } from '@/shared/api';

export type FileUploadPurpose = 'receipt' | 'payment-proof';

export const fileKeys = {
  all: ['files'] as const,
};

export function useUploadFile() {
  return useMutation({
    mutationFn: async ({
      file,
      purpose = 'receipt',
    }: {
      file: File;
      purpose?: FileUploadPurpose;
    }) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        return await api
          .post('files', {
            searchParams: { purpose },
            body: formData,
          })
          .json<FileResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
  });
}
