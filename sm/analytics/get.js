
// Simple place to store all the results before printing to the user.
var output = [];


var realtime = function(id, position) {

    var apiQuery = gapi.client.analytics.data.realtime.get({
        'ids': 'ga:' + id,
        'metrics': 'rt:activeUsers'
    })
    apiQuery.execute(function(results) {

        var el = document.getElementsByClassName('realtime' + position);
        if(!el[0]) {
            return
        }
        if(results.rows && results.rows[0][0] ) {

            el[0].innerHTML = results.rows[0][0];

        } else {
            el[0].innerHTML = '0';
        }
    })
};

var allRealtime = function(ids) {

        ids.forEach(function(id, position) {
            realtime(id, (position + 1 ));
        })
}


function pollRealtime(ids) {

    allRealtime(ids);

    setInterval(function() {

        allRealtime(ids);

    }, 5000)

}

function getGraph(ids, callback) {

    pollRealtime(ids)

    async.map(ids, function(id, next) {




        var apiQuery = gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + id,
            'start-date': '2014-03-01',
            'end-date': '2017-04-25',
            'metrics': 'ga:pageviews',
            dimensions: 'ga:date',
            'max-results': 10000
        });
        apiQuery.execute(function(results) {


            if (!results.error) {
                // Success. Do something cool!
            } else {
                alert('There was an error: ' + results.message);
            }

            var formattedResults = results.rows.map(function(item) {
                return {
                    date: moment(item[0], "YYYYMMDD").format('YYYY-MM-DD'),
                    value: parseInt(item[1])
                }
            })




            formattedResults = MG.convert.date(formattedResults, 'date');



            next(null, {
                name: results.profileInfo.profileName,
                timeseries: formattedResults,
            });

        });
    }, function(err, datas) {


        var graphData = [];
        var columns = [];
        datas.forEach(function(item) {
            graphData.push(item.timeseries);
            columns.push(item.name)
        })

        callback(null, columns, graphData)
    })



}

setTimeout(function() {


    var el = document.getElementById('graph-key')
        var markers = [
            { date: new Date('2015-05-26'), label: 'LNUG EnahnceConf Talk'},
            { date: new Date('2015-10-26'), label: 'Full Stack EnahnceConf Talk'},
            { date: new Date('2016-03-16'), label: 'EnahnceConf'},
            { date: new Date('2017-04-16'), label: 'Added sitemap for simonmcmanus.com'},

        ]
    var options = {
        title: "Websites overview",
        description: "Combined view over different sites on time series",
        width: window.outerWidth,
        height: el.offsetTop,
        right: 40,
        target: '#fake_users2',
        legend_target: '.legend',
        markers: markers
    }



  analyticsAuth(function(err) {

    if(!err) {
        getGraph(['72387143', '101093416', '137508472', '80083424', '129572148'], function(err, columns, data) {
            options.data = data;
            options.legend = columns;
            MG.data_graphic(options);

        })





    }

  });


}, 3000)


