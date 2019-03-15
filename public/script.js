$(() => {
    let search = $('#searchAirport')
    let searchButton = $('#search')
    let airportsList = $("#airportsList")

    searchButton.on('click', (event) => {
        event.preventDefault()
        getAirportslist()
    })

    function getAirportslist() {
        $("#airportsList").empty()
        $.get(`/search?q=${search.val()}`, (data) => {
            data.map(airport => {
                airportsList.append(
                    $('<li>')
                    .attr('class', "list-group-item")
                    .append(
                        $('<span>')
                        .attr('class', "py-1")
                        .text(airport.name)
                      .append(
                        $('<a>')
                        .text("Edit")
                        .attr('class', "btn btn-warning ml-5")
                        .attr('data-id', `${airport.code}`)
                        .attr('href', `/edit/${airport.code}`)
                      )
                      .append(
                        $('<button>')
                        .text("Delete")
                        .attr('class', "btn btn-danger ml-2")
                        .attr('data-id', `${airport.code}`)
                        .click(function (event) {
                          event.preventDefault()
                          let id = $(this).attr('data-id')
                          $.post('/delete', {airportId: id}, (data) => {
                            getAirportslist()
                          })
                        })
                      )
                    )
                  )
            })
        })
    }
})