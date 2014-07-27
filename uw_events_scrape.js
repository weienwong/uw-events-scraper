#!/usr/bin/node

var request = require('request');
var cheerio = require('cheerio');
var main_site = 'https://uwaterloo.ca/events/events';
var main_uw_site = 'https://uwaterloo.ca';

request(main_site, function(error, response, html){
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

          var Event = {
            Name: title,
            Host: event_host,
            When: event_times,
            Where: [event_bldg, room, street, city, postal_code, country],
            Website: event_website
          };
          console.log(Event);
        }
      });
    });
  }
});

