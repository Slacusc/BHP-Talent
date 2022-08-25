

const TablaBhp = () => {


    const [parsedData, setParsedData] = useState([])
    const [columns, setColumns] = useState([])
    // const [selectedColumns, setSelectedColumns] = useState([])
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

    const createColumns = (data) => {
        const columns = []
        data.forEach((item) => {
          columns.push({
            name: item,
            selector: row => row[item],
            sortable: true
          })
  
        })
  
        setColumns(columns)

      }

      const parseFile = (data) => {
        Papa.parse(
          data,
          {
            header: true,
            complete: (result) => {
              createColumns(Object.keys(result.data[0]))
              setParsedData(result.data)
  
              setTimeout(() => {
                setLoading(false)
              }, 2000)
            }
          }
  
        )
      }


    return (
      <>
      <main>
  <div className="container flex flex-col text-center">
   
        <input type="file" id="file1" name="file1"></input>
        <button className=" bg-orange-2-bph" onClick={readFile}>Cargar</button>
        {loading && <Loader />}

   <table cellspacing="0" className="m-5 bg-white rounded-lg">
      <tr className="  h-14 bg-blue-grey-2-bph rounded-lg ">
         <th>{name}</th>
         <th>Name</th>
         <th>Email</th>
         <th>Phone</th>
         <th>Name</th>
         <th>Email</th>
         <th>Phone</th>
      </tr>
        
      <tr className=" bg-blue-grey-4-bph">
         <td>Jane Doe</td>
         <td>jane.doe@foo.com</td>
         <td>01 800 2000</td>
         <td>jane.doe@foo.com</td>
         <td>01 800 2000</td>
         <td>jane.doe@foo.com</td>
         <td>01 800 2000</td>
      </tr>
      
      <tr>
         <td>John Doe</td>
         <td>john.doe@foo.com</td>
         <td>01 800 2000</td>
         <td>jane.doe@foo.com</td>
         <td>01 800 2000</td>
         <td>jane.doe@foo.com</td>
         <td>01 800 2000</td>
      </tr>

      
   </table>
   </div>
   </main>
     </>
    );
  }

  export default TablaBhp