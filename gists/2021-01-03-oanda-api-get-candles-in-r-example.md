```r
library(httr)
library(jsonlite)

Sys.setenv(
  OANDA_ACCESS_TOKEN = "..."
)

get_candles <- function(instrument, pratice=TRUE, ...) {
  # https://developer.oanda.com/rest-live-v20/instrument-ep/
  
  endpoint <- "https://api-fxpractice.oanda.com"
  url <- paste(endpoint, "v3", "instruments", instrument, "candles", sep="/")
  
  resp <- httr::GET(
    url,
    add_headers(Authorization = paste("Bearer", Sys.getenv("OANDA_ACCESS_TOKEN"), sep = " ")), 
    accept_json(),
    query = list(...)
  )

  cont <- httr::content(resp, as = "text", encoding = "UTF-8")
  data <- jsonlite::fromJSON(cont, simplifyDataFrame = TRUE)
  
  return(data)
}

today_date <- as.POSIXlt(Sys.time(), "UTC", "%Y-%m-%dT%H:%M:%S")
today_date_str <- strftime(today_date , "%Y-%m-%dT%H:%M:%SZ")

data <- get_candles('EUR_USD', from = "2009-01-01T00:00:00Z", to = today_date_str, granularity = "D", alignmentTimezone = "US/Eastern")


```
