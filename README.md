# advent-of-code

Solutions to the daily programming challanges of https://adventofcode.com/

To use this code, you need to provide your own session cookie file. This file sits in the base path and needs to contain your cookie of http://adventofcode.com/ .
To optain this cookie, use the developer console an navigate to one of the input pages while beeing logged in. (e.g. http://adventofcode.com/day/1/input)
Open your browser developer console and navigate to the networking tab. Refresh the page and inspect the newest request. In your request information, there should be a cookie which should look like this:

`session=53ca...`

Place this string (<strong>without the semicolon</strong>) into the sessionCookie.txt file in the root of this repository.
