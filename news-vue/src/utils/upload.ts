import { ElMessage } from 'element-plus'
import type { UploadFile, UploadFiles, UploadRawFile } from 'element-plus'

export const handleAvatarSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (uploadFile.raw) {
    const url = URL.createObjectURL(uploadFile.raw)
    return url
  }
  return ''
}

export const beforeAvatarUpload = (rawFile: UploadRawFile) => {
  if (!rawFile.type.startsWith('image/')) {
    ElMessage.error('上传头像图片格式不正确')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传头像图片大小不能超过 2MB')
    return false
  }
  return true
} 