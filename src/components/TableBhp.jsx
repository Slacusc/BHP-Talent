import React, {useState} from "react"
import Papa, { parse } from "papaparse"
import * as XLSX from "xlsx"


const Loader = () => {


  
  Papa.parse(url, {
    download: true,
    // rest of config ...
  })
  return (
    <div>
      <h3>Cargando BHP Payroll...</h3>
    </div>
  )
}

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

      const columnsData = [...parsedData]
      
    return (
      <>
      <main>
  <div className="container flex flex-col text-center">
   
        <input type="file" id="file1" name="file1"></input>
        <button className=" bg-orange-2-bph" onClick={readFile}>Cargar</button>
        {loading && <Loader />}
<section className=" h-60">
   <table cellSpacing="0" className="m-5 bg-white rounded-lg">
      <thead>
      <tr className="  h-14 bg-blue-grey-2-bph rounded-lg ">
         <th>Id Employee</th>
         <th>Name</th>
         <th>Wage Type</th>
         <th>Wage Type Long Text</th>
         <th>Past</th>
         <th>Current</th>
         <th>Difference</th>
      </tr>
      </thead>

      <tbody>
        { columnsData.map( (column) => (
   

          //key={`${element.name}${element.key}`}
        <tr className=" bg-blue-grey-4-bph">
         <td>{column.id}</td>
         <td>{column.name}</td>
         <td>{column.wt} </td>
         <td>{column.wtlt} </td>
         <td>{column.past} </td>
         <td>{column.current} </td>
         <td>{parseFloat(column.past) - parseFloat(column.current) } </td>
      </tr>
      )) }
      
      </tbody>

   </table>
   </section>
   </div>
   </main>
     </>
    );
  }

  export default TablaBhp