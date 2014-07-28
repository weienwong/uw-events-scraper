#!/usr/bin/node

var request = require('request');
var cheerio = require('cheerio');
var main_site = 'http://www.feds.ca/events/upcoming/';

function info_scrape(url){

  request(url, function(error, response, html){
    
    if (!error && response.statusCode == 200){ 
      var $ = cheerio.load(html);
      var title = $("dd.event-meta-name").text();
      var event_host = $("dd.event-meta-author").text();
      
      var event_times;
    
      if ($("dd.event-meta-start").length == 0){
        event_times = $("dd.event-meta-date").text();
      }
      else{
        event_times = $("dd.event-meta-start").text() + " to " + $("dd.event-meta-end").text();
      }
      
      var event_bldg = $("dd.event-meta-venue").text();
      var event_website = "";
      var event_type = $("dd.category-meta").text().split(); 


      var Event = {
        Name: title,
        Host: event_host,
        When: event_times.trim(),
        Where: [event_bldg.trim()],
        Website: event_website,
        Category: event_type
      };
      
        console.log(Event);
    }
    
    else{
      console.log("Connection failed");
      console.log(error);
      console.log(response.statusCode);
    }
    
  });
}

function get_event_pages(){

  request(main_site, function(error, response, html){
    
    if (!error && response.statusCode == 200){ 
      var $ = cheerio.load(html);
      var event_listings_urls = []

      $('div.type-tribe_events').each(function(){
        var event_page_url = $(this).find("h2.entry-title > a").attr("href");
        event_listings_urls.push(event_page_url);
      });

      for (var i = 0; i < event_listings_urls.length; i++){
        info_scrape(event_listings_urls[i]);
      }

    }
    
    else{
      console.log("Connection failed");
      console.log(error);
      console.log(response.statusCode);
    }
    
  });
}


// parse main event_listings page
// for event url's
// perform a scrape on the event url page
// check for the next page
// if next page url == current page url, we're done
// else navigate to next page
//
get_event_pages();

