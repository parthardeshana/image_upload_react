import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

function App() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [custodianName, setCustodianName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progressBarPercentage, setProgressBarPercentage] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "*",
    onDrop: (acceptedFiles) => {
      let tempArr = []
      tempArr = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
      setFiles(files.concat(tempArr))
    }
  })

  const imageRender = (files) => {
    return (
      <>
        {files.map(file => (
          <>
            {file.type === "image/png" || file.type === "image/jpeg" ?
              <img
                className="m-1"
                key={file.name}
                src={file.preview}
                alt="image"
                width={60}
                height="auto" />
              : <p style={{ width: "60px" }} className='d-inline border border-dark m-1'> {file.name} </p>}
          </>
        ))}
      </>
    )
  }

  const onClickHandler = () => {
    var currentUploadIndex = 0;
    if (files.length > 0) {
      setIsLoading(true)
      const DURATION_TO_UPLOAD_SINGLE_FILE_MS = 500;

      let batchObj = {
        name: custodianName,
        isUploaded: false,
        imgArr: []
      }

      var timerRef = setInterval(() => {
        if (currentUploadIndex === files.length) {
          setIsLoading(false)
          batchObj.imgArr = files
          batchObj.isUploaded = true
          setUploadedFiles(uploadedFiles.concat(batchObj))
          setCustodianName("")
          setFiles([])
          setProgressBarPercentage(0)
          clearInterval(timerRef);
        }
        setProgressBarPercentage((currentUploadIndex / files.length) * 100);
        currentUploadIndex++;
      }, DURATION_TO_UPLOAD_SINGLE_FILE_MS);
    }
  }

  const handleChange = (e) => {
    setCustodianName(e.target.value)
  }

  return (
    <div className="w-75 m-auto">
      <div className='mt-5 pt-5' >
        <div className="dropArea p-2 d-flex flex-column justify-content-center  border border-dark" style={{ height: "200px", background: "rgb(123 192 190)" }}  {...getRootProps()}>
          <div className='mw-75'>
            {imageRender(files)}
          </div>
          <input style={{ border: "5px solid red" }} placeholder='Drop here..' {...getInputProps()} />
          <div style={{ textAlign: "center" }} className="d-flex flex-column justify-content-center align-items-center">
            <button className='btn btn-light btn-lg d-flex justify-content-center align-items-center'>
              <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
              </svg>
              CHOOSE FILES
            </button>
            <p className='text-light'> Or Drop Files here</p>
          </div>
        </div>
      </div>
      {isLoading ?
        <>
          <div class="spinner-border text-primary d-block m-auto mt-4" role="status" />
          <h5 class="d-block m-auto text-center mt-4">Uploading File..... </h5>
          <div className="progress my-2">
            <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{ width: `${progressBarPercentage}%` }} aria-valuenow={progressBarPercentage} aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </>
        : <>
          {files.length > 0 ?
            <div className="d-flex justify-content-center align-items-center mt-4">
              <input placeholder="Enter Custodian Name" value={custodianName} onChange={handleChange} type="text" />
              <button disabled={!custodianName} className='btn btn-primary mx-2' onClick={onClickHandler} > Upload Files </button>
            </div>
            : null}
        </>
      }

      <div className="mt-4">
        {uploadedFiles.map((batch) => (
          <div className="my-3">
            <h5>{batch.name}</h5>
            {imageRender(batch.imgArr)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

