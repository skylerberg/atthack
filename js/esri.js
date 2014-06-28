var geotriggers = new Geotrigger.Session({
      clientId: "b0UCz8UK8IDI75gs",
      clientSecret: "b6d1dded281f4d54b640fd8ccff9ae4f"
});

//for (var x in geotriggers) {
//    alert(x);
//    alert(geotriggers[x]);
//}

geotriggers.request(
        "trigger/create", 
        { 
            triggerId: "inABar",
            condition: {
                direction: "enter",
                geo: {
                    latitude: 0,
                    longitude: 0,
                    distance: 0
                }
            },
            action: {
                notification: {
                    text: "You are in a bar!"
                }
            },
            setTags: "bar" 
        }, 
        function(error, response, xhr) {
            alert(error);
            alert(response);
            alert(xhr);
        }
);

geotriggers.request(
        "trigger/list", 
        { tags: ["bar"] }, 
        function(error, response, xhr){
            alert(error);
            alert(response);
            alert(xhr);
        }
);

//geotriggers.request("trigger/list", {
//      tags: ["portland"]
//}, function(error, response, xhr){
//      console.log(error, response, xhr);
//});


