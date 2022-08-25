import React, { useState, useEffect } from "react"

import Papa, { parse } from "papaparse"
import * as XLSX from "xlsx"


const Loader = () => {
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

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")


  const readUrl = (url) => {

    setLoading(true)
    parseFile2(url)


  }

  const readFile = (file1) => {

   
  

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
          alert("Carga exitosa")

        }
      }

    )

  }

  const parseFile2 = (url) => {
    Papa.parse(
      url,
      {
        download: true,
        complete: (result) => {
          result.data.splice(0,2)
          // createColumns(Object.keys(result.data[0]))
          setParsedData(result.data)
          console.log(result.data)

          setTimeout(() => {
            setLoading(false)
          }, 2000)
          alert("Carga exitosa")
        }
      }



    )
  }

  const loadbutton = () =>{
    const url = document.getElementById("file2").value
    const e = document.getElementById("file1")
    const [file1] = e.files
    if (!file1 && url) {
      readUrl(url)
      // return
    }else{
      readFile(file1)
    }


    
  }

  const columnsData = [...parsedData]


  const showData = async () => {
    const response = await fetch(columnsData)
    // const data = await response.columnsData

    // setUsers(data)
  }

  // showData()
  const searcher = (e) => {
    setSearch(e.target.value)
    console.log(e.target.value)
  }

  //metodo de filtrado

  let results = [...parsedData]
  if (!search) {
    // results = columnsData
   console.log("nope")
  } else {
    results = columnsData.filter((dato) =>
      dato.wt.toLowerCase().includes(search.toLocaleLowerCase())

    )
  }

  console.log(results)



  useEffect(() => {
    showData()
  }, [])


  return (
    <>

      <main>
        <div className="container flex flex-col text-center">

          <input type="file" id="file1" name="file1"></input>
          <input type="url" id="file2" name="file2" placeholder="Pega la URL"></input>
          <button className=" bg-orange-2-bph" onClick={loadbutton}>Cargar</button>
          {loading && <Loader />}
          <input value={search} onChange={searcher} type="text" placeholder='Search' className='form-control' />
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
                {results.map((column) => (


                  //key={`${element.name}${element.key}`}
                  <tr className=" bg-blue-grey-4-bph">
                    <td>{column.id}</td>
                    <td>{column.name}</td>
                    <td>{column.wt} </td>
                    <td>{column.wtlt} </td>
                    <td>{column.past.replace(/,/g, ".")} </td>
                    <td>{column.current.replace(/,/g, ".")} </td>
                    <td>{(Number(column.past.replace(/,/g, "")) - Number(column.current.replace(/,/g, ""))).toLocaleString()} </td>
                  </tr>
                ))}

              </tbody>

            </table>
            <button className=" bg-orange-2-bph" >Descargar</button>

          </section>
        </div>
      </main>
    </>
  );

}


export default TablaBhp