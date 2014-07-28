#!/usr/bin/node

var request = require('request');
var cheerio = require('cheerio');
var main_site = 'https://uwaterloo.ca/events/events';
var main_uw_site = 'https://uwaterloo.ca';
var start_page = "https://uwaterloo.ca/events/events?date=Current&type=All&audience=All&page=0";

// USAGE: deep_event_scrape(array)
// Takes in an array of URL's to event lists 
// Scrapes the link in each event listing on,
// navigates to event page, and scrapes
// Event information from event page
// Outputs data in JSON format
// i.e.: scrapes data 1 level deep
// 

function deep_event_scrape(url){

      
    request(url, function(error, response, html){
      if (!error && response.statusCode == 200){
        
        var $ = cheerio.load(html);
        $('h3.event-title > a').each(function(i, element){
          var events_page = main_uw_site + $(this).attr('href');
          request(events_page, function(error, response, html){

            if (!error && response.statusCode == 200){
              var $_ = cheerio.load(html);
              var title = $_('h1').text();
              var event_times = $_('div.field_event_date').text();      
              var event_host = $_('div.field_event_host_link').find('a').text();
              var event_website = $_('div.field_event_moreinfo_link').find('a').attr('href');
              var event_bldg = $_('div.adr > span.fn').text();
              var room = $_('div.adr > div.additional').text();
              var street = $_('div.street-address').text();
              var city = $_('span.locality').text();
              var prov = $_('span.region').text();
              var postal_code = $_('span.postal-code').text();
              var country = $_('div.country-name').text();

              var types_array = [];
              var event_types = $_('div.field_uw_event_tag').find('a').each(function(){
                types_array.push($_(this).text());  
              });


              var Event = {
                Name: title,
                Host: event_host,
                When: event_times.trim().replace('\n',''),
                Where: [event_bldg.trim(), room.trim(), street.trim(), city.trim(), postal_code.trim(), country.trim()],
                Website: event_website,
                Category: types_array

              };
              console.log(Event);
            }
          });
        });
      }
    });
}

// USAGE: get_event_pages()
// Looks for all event pages that list current and upcoming events
// stores links to event listings into an array
// passes array of event listings into deep_event_scrape

function get_event_pages(){

  request(start_page, function(error, response, html){
    if (!error && response.statusCode == 200){
      var $ = cheerio.load(html);
      var urls = [start_page];

      $("li.pager-item").each(function(){
        var page_link = $(this).find("a").attr("href");
        urls.push(main_uw_site + page_link);
      });

      for (var i = 0; i < urls.length; i++){
        deep_event_scrape(urls[i]);
      }
      
      

    }
  });
}

get_event_pages();
