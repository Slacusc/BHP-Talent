import Papa from "papaparse"
import * as XLSX from "xlsx"
import { useState } from 'react'
import DataTable from "react-data-table-component"
import './App.css'
import firebaseConfig from "./firebase/config"

const Loader = () => {
  return (
    <div>
      <h3>Cargando BHP Payroll...</h3>
    </div>
  )
}


const App = () => {

  const [parsedData, setParsedData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState([]);


  const readFile = () => {

    const e = document.getElementById("file")
    const [file] = e.files
    if(!file){
      console.log("nope")
      return
    }

    setLoading(true)

    const reader = new FileReader()

    reader.onload = (evt) => {
      const bstr =evt.target.result  
      const wb = XLSX.read(bstr, {type: "binary"})
      const wsname =wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1})
      parseFile(data)
    }
    reader.readAsBinaryString(file)
  }

  const createColumns = (data) => {
    const columns = []
    data.forEach((item) => {
      columns.push({
        name: item,
        selector: row =>row[item],
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
        complete: (result)=> {
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
    <div className="App">
      <input type="file" id="file" name="file"></input>
      <button onClick={readFile}>Cargar</button>
      { loading && <Loader />}
      { !loading && columns.length > 0 && parsedData.length > 0 && <DataTable columns={columns} data={parsedData} pagination /> }
    </div>
)
}

export default App
