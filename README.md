# colorSchemeGenerator
Base requirements for this project are to use color api to produce a color scheme from a single hex and mode selected from the inputs.
This can be done with a simple fetch with variables in the query string and then loop through the data and render to the DOM.

I decided to use a constructor function on the data so that I could augment more of the data that was returned and give the 
user more control over what was displayed. I added in the ability to choose from a hex, rgb, or hsl code.
Also added in function of saving previous searches in an array, and allowing the user to revisit them, lets say they try a new one,
but liked the previous one better, it is there.

Since I used the constructor function and a single render function to control almost all page changes I was able to expirement 
with the view transition api. That is interesting and simple, I left it at its base functionality to show how easy it is to use
and to show that even the default behavior is helpful. I could see myself using it a lot more to control page animation and want to 
explor it more.

This was an interesting project that I am proud of. I like the way my code ties into itself and connects for, what I feel is, a functional result.

