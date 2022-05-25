import axios from 'axios'

let domainValue = 'http://files.flownet.efoxconn.com'

interface IverifyResponse {
  token: string;
}

function uploadAll (file: File, fileGuid: string, token: string, resolve: (value: unknown) => void, reject: (value: unknown) => void) {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('fileGuid', fileGuid)
  formData.append('isVersionControl', 'N')
  formData.append('isPrivate', false as any)

  axios.post(
    domainValue + '/files/uploadAll',
    formData,
    {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data'
      }
    }
  ).then(() => {
    resolve(fileGuid)
  }).catch(err => {
    reject(new Error('upload file failed: ' + err))
  })
}

// function uploadChunk (file, fileID, token, resolve, reject) {

// }

function handleUpload (file: File, fileID: string, token: string, resolve: (value: unknown) => void, reject: (value: unknown) => void) {
  uploadAll(file, fileID, token, resolve, reject)
}

function createFileID (file: File, token: string, resolve: (value: unknown) => void, reject: (value: unknown) => void) {
  axios.get(
    domainValue + '/files/createGUID',
    {
      headers: {
        Authorization: token
      }
    }
  ).then(res => {
    const fileGuid = res.data
    handleUpload(file, fileGuid, token, resolve, reject)
  }).catch(err => {
    reject(new Error('create file id failed: ' + err))
  })
}

function verifyAccount (account: string, password: string, file: File, resolve: (value: unknown) => void, reject: (value: unknown) => void) {
  const params = {
    account: account,
    password: password
  }
  axios.post<IverifyResponse>(
    domainValue + '/fileAccount/login',
    params
  ).then(res => {
    const token = 'Bearer ' + res.token
    createFileID(file, token, resolve, reject)
  }).catch(err => {
    reject(new Error('verify account failed: ' + err))
  })
}
export function uploadWithAccount (domain: string, account: string, password: string, file: File) {
  if (domain) {
    domainValue = domain
  }
  if (account && password) {
    return new Promise(function (resolve, reject) {
      verifyAccount(account, password, file, resolve, reject)
    })
  }
  return Promise.reject(new Error('account or password missing'))
}