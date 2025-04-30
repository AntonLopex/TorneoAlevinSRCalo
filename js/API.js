https://docs.google.com/spreadsheets/d/1bWqNmdqAiUJReQCB4PkP43_BHSBbFvDP/edit?gid=1042050523#gid=1042050523

const sheetID = 'TU_ID_DE_HOJA'
const gid = '0' // cambia por el número de hoja que necesites
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&gid=${gid}`

fetch(url)
  .then(res => res.text())
  .then(data => {
    const json = JSON.parse(data.substring(47).slice(0, -2))
    const rows = json.table.rows
    rows.forEach(row => {
      console.log(row.c.map(cell => cell?.v))
    })
  })
