import TablaBhp from "./TableBhp"


const LoadFile = () => {

    const [loading, setLoading] = useState(false)


    const readFile = () => {

        const e = document.getElementById("file1")
        const [file1] = e.files
        if (!file1) {
          console.log("nope")
          return
        }
  
  
        setLoading(true)

        const reader = new FileReader()

        reader.onload = (evt) => {
            const bstr = evt.target.result
            const wb = XLSX.read(bstr, { type: "binary" })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 })
            parseFile(data)
    
            // console.log(data)
          }
          reader.readAsBinaryString(file1)
        }

    return (
      <>
        <input type="file" id="file1" name="file1"></input>
        <button className=" bg-orange-2-bph" onClick={readFile}>Cargar</button>
        {loading && <Loader />}
        {!loading && columns.length > 0 && parsedData.length > 0 && <TablaBhp columns={columns} data={parsedData}  />}

     </>
    );
  }

  export default LoadFile