<script lang="tsx">
console.log('test')
import { defineComponent, ref } from 'vue'
import { uploadWithAccount } from '@/utils/uploadFile'

export default defineComponent({
  name: 'Test',
  setup() {
    const uploadRef = ref(null)
    const fileObj = {
      file: null,
      chunkList: []
    }
    const createChunk = (file, chunkSize=1024*1024) => {
      const chunkList = [];
      let curIndex = 0;
      while (curIndex < file.size) {
        chunkList.push({
          file: file.slice(curIndex, curIndex + chunkSize)
        });
        curIndex += chunkSize;
      }
      return chunkList;
    }
    const uploadFile = (rawFile: File) => {
      uploadWithAccount('', 'eduAdmin', 'Foxconn123', rawFile).then(id => {
        console.log('id', id)
      }).catch(err => {
        console.log('err', err)
      })
    }
    const triggerUpload = () => {
      (uploadRef.value as any).value = null;
      (uploadRef.value as any).click();
    }
    const axiosRequest = ({
      url,
      headers = {},
      onUploadProgress = (e) => e
    }) => {
      return new Promise((resolve, reject) => {
        axios.post(
          url,
          data,
          {
            headers,
            onUploadProgress
          }
        ).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        })
      })
    }
    const createProgressHandle = (item) => {
      return (e) => {
        item.percent = parseInt(String((e.loaded / e.total)* 100));
      }
    }
    const uploadChunks = async () => {
      const requestList = fileObj.chunkList.map(({ file, fileName, index, chunkName }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('chunkName', chunkName);
        return { formData, index };
      }).map(({ formData, index }) => {
        return axiosRequest({
          url: 'http://xxx',
          data: formData,
          onUploadProgress: createProgressHandle(fileObj.chunkList[index])
        })
      })
      await Promise.all(requestList);
    }
    const handleChange = (ev: Event) => {
      const files = (ev.target as HTMLInputElement).files;
      fileObj.file = files[0];
      console.log('file', fileObj.file)
      if (!fileObj.file) {
        return
      }
      const chunkList = createChunk(fileObj.file)
      fileObj.chunkList = chunkList.map(({ file }, index) => {
        return {
          file,
          size: file.size,
          percent: 0,
          chunkName: `${fileObj.file.name}-${index}`,
          fileName: fileObj.file.name,
          index
        }
      })
      // uploadChunks();
      console.log('chunklist', chunkList)
      // uploadFile(files[0]);
    }
    return () => (<div>
      <input ref={uploadRef} onChange={ handleChange } style="display: none;" type="file" multiple="multiple" />
      <button onClick={ triggerUpload }>upload</button>
    </div>)
  }
})
</script>