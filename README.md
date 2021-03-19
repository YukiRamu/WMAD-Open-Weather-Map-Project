<h1 align="center">☀️Open Weather Map Project☀️</h1>
<h3 align="left">⚓Website: <a href = "https://yuki-m.ciccc.tech/">Weather Forecast on Earth</a></h3>
<h3 align="left">💡Features for Users:</h3>

- Fetch API to fetch the data from Open Weather API
- Vancouver weather in default
- Search function for other cities
- Validation check for the search (number? null? or invalid city?)
- 2-mins auto refresh
- Displayed information : Name of the city, Date and Time *1), Sunrise time, Sunset time, Current Temperature, Weather description, Feels like, Humidity, and Pressure
- Dynamic unit change between "°F" and "°C"
- Full forecast *2)

<h3 align="left">🙇‍♀️Under Construction:</h3>
  *1) Date and Time refresh every 2 minutes, not instantly.<br>
  *2) This function is still under construction.

<h3 align="left">🗝️JavaScript Explanation:</h3>
  <h4>🧱Structure of the code</h4>
  1. Variable Declaration<br>
  2. Function Declaration with 4 functions included<br>
  3. Function call <br>

  <h4>❓Why I pick up this instead of this? Clarify the reason of the code structure.</h4>
  ⚈ "let" and "const" keyword difference<br><br>
  ⚈ Created HTML tags with innerHTML one by one<br>
     ➡Since the code only obtains one set of weather data (one object), instead of using .map() method and creating html tags inside JavaScript code,
      I have created the base html tags inside html file and append each data one by one.<br>
  
  ![image](https://user-images.githubusercontent.com/76931326/111812215-222fe180-8895-11eb-99cc-8bb6454c12fd.png)
  
<h4>🏴󠁵󠁳󠁭󠁥󠁿The main function</h4>
<a href ="https://github.com/YukiRamu/WMAD-Open-Weather-Map-Project/blob/master/Midterm_Note.pdf" target = "_blank">🔗Detailed explanation available here</a>
<br><br>


![image](https://user-images.githubusercontent.com/76931326/111107931-0f27b500-8515-11eb-9800-4e3d0e5a9cda.png)

<h3 align="left">📚Reference:</h3>
<p align="left">API: Open Weather Map (https://home.openweathermap.org/users/sign_in)</p>

![image](https://user-images.githubusercontent.com/76931326/110907174-dc39b300-82c1-11eb-85d7-27464cf5c7e5.png)

