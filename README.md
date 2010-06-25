<p>
Table of Conents
<ul>
<li><a href="#intro">Introduction</a></li>
<li><a href="#using">Getting Started with StackUnderflow.js</a></li>
<li>
    <a href="#api">API Reference</a>
    <ul>
        <li><a href="#appId">stackunderflow.appId</a></li>
        <li><a href="#site">stackunderflow.site</a></li>
        <li><a href="#loaded">stackunderflow.loaded</a></li>
        <li><a href="#google">stackunderflow.googleQuestions</a></li>
        <li><a href="#getQuestions">stackunderflow.getQuestions</a></li>
        <li><a href="#searchQuestions">stackunderflow.searchQuestions</a></li>
        <li><a href="#getQuestionsWithTags">stackunderflow.getQuestionsWithTags</a></li>
        <li><a href="#getQuestionsByUser">stackunderflow.getQuestionsByUser</a></li>
        <li><a href="#renderQuestions">stackunderflow.render.questions</a></li>
    </ul>
</li>
<li><a href="#templating">HTML Templating</a></li>
<li><a href="#css">Customizing CSS</a></li>
</ul>
</p>

<div>
<img src="http://infinity88.com/stackunderflow/stackunderflow.png" />StackUnderflow
</div>

<a name="intro"></a>
<h1>Introduction</h1>
<p>
StackUnderflow.js is a lightweight JavaScript library that makes retrieving and rendering question summary information from StackExchange sites simple. It supports retrieving questions by Question ID, tags, keyword, and even by Google search results to enable you to search the body of questions, even though the StackExchange API does not support it (currently limited to 8 results).
</p>
<p>
Also, because it is hosted and designed to be easily usable from anywhere, it couldn't be easier to get StackExchange data to display on your own websites. Some awesome examples of this capability:
<ul>
<li>Display questions that link to your blog.</li>
<li>Display questions that link to the current blog article.</li>
<li>Display questions related to keyword or tags on a bug tracking site.</li>
<li>Display questions related to a feature directly from online documentation for your products.</li>
</ul>

<p>Here is StackUnderflow.js pulling in questions that link to my blog:</p>
<img src="http://infinity88.com/stackunderflow/StackUnderflowScreen.png" alt="" />
</p>

<a name="using"></a>
<h1>Getting Started with StackUnderflow.js</h1>
<p>
Simply include the script and the default css on your page:
<pre>
&lt;link type="text/css" rel="Stylesheet" href="http://infinity88.com/stackunderflow/stackoverflow.min.css" /&gt;
&lt;script type="text/javascript" src="http://infinity88.com/stackunderflow/stackunderflow-1.0.2.min.js"&gt;&lt;/script&gt;
</pre>
Then, you can immediately start using the API. It will take care of ensuring the document has fully loaded before rendering anything, should you choose to do that.
<pre>
&lt;script type="text/javascript"&gt;
stackunderflow.getQuestionsWithTags("asp.net;viewstate").render("#results");
&lt;/script&gt;
</pre>
</p>

<a name="api"></a>
<h1>API Reference</h1>
<p>
StackUnderflow.js APIs let you search for StackExchange questions using any StackExchange site. You may get the raw data returned from StackExchange to do with what you want, but the real power comes from its render() function, which can render questions in the same familiar summary format you have seen on StackExchange sites already. The look for the rendering is completely customizable, either through CSS, a simple html templating language, or both. By default, the rendering will look like StackOverflow.com, but with your own sites background color.
</p>

<a name="appId"></a>
<h2>stackunderflow.appId (optional)</h2>
<p>
This is a global setting that changes the appId used when querying StackExchange. By default, the key is the appId for StackUnderflow.js. You may wish to set it to your own StackExchange key for tracking and API limit reasons.
<pre>
stackunderflow.appId = "&lt;my app id&gt;";
</pre>
</p>

<a name="site"></a>
<h2>stackunderflow.site (optional)</h2>
<p>
This is a global setting that sets the StackExchange site to query against. Set it to the home url for the site. For example, the default value is "http://stackoverflow.com". Do not include a trailing slash or any other information.
<pre>
stackunderflow.site = "http://superuser.com";
</pre>
</p>

<a name="loaded"></a>
<h2>stackunderflow.loaded(callback)</h2>
<p>
Registers a handler that is called when the DOM is loaded, after which it is safe to modify the DOM tree. Note that if the DOM has already loaded, the callback will be executed immediately, but not if the DOM was already loaded when StackUnderflow.js itself was first loaded (advanced scenario that is only important if you are loading StackUnderflow.js dynamically).
<pre>
stackunderflow.loaded(function() {
    // do stuff
});
</pre>
</p>

<a name="google"></a>
<h2>stackunderflow.googleQuestions([optional]term, [optional]complete(questions))</h2>
<p>
Searches the current StackExchange site with Google for questions containing the given search term, then loads the questions with the StackExchange API.
<ul>
<li><strong>term</strong> The query to search for. May be of any format you can search Google for, such as with quotes for hard matches on multiple words. If not given, the search term will be equal to the complete current page URL in quotes. This is useful, for example, to find StackExchange questions that link to the current page.</li>
<li><strong>complete</strong> A function that is called when the results have been retrieved. A single parameter is given -- an instance of a <a href="http://api.stackoverflow.com/0.9/help/method?method=questions" target="_blank">questions result</a> as defined by the StackExchange API.</li>
</ul>
The return value is a context object that contains additional methods that operate on the future results. See the section on <i>chaining</i> for details.
<pre>
stackunderflow.googleQuestions("asp.net viewstate", function(result) {
    alert(result.questions.length);
});
</pre>
</p>


<a name="getQuestions"></a>
<h2>stackunderflow.getQuestions(questionIds, [optional]complete(questions))</h2>
<p>
Retrieves one or more questions from the StackExchange API.
<ul>
<li><strong>questionIds</strong> A string containing the list of questions to retrieve, or an array of question ids to retrieve multiple questions.</li>
<li><strong>complete</strong> A function that is called when the results have been retrieved. A single parameter is given -- an instance of a <a href="http://api.stackoverflow.com/0.9/help/method?method=questions" target="_blank">questions result</a> as defined by the StackExchange API.</li>
</ul>
The return value is a context object that contains additional methods that operate on the future results. See the section on <i>chaining</i> for details.
<pre>
stackunderflow.getQuestions([2977508, 2977462], function(result) {
    alert(result.questions.length);
});
</pre>
</p>

<a name="searchQuestions"></a>
<h2>stackunderflow.searchQuestions([optional]intitle, [optional]tagged, [optional]notTagged, [optional]complete(questions))</h2>
<p>
Searches for questions from the StackExchange API. You may search by question title or tags (having or not having). Although the three search term parameters are all optional, you must specify at least one of the tree.
<ul>
<li><strong>intitle</strong> A string containing the search term to match against question titles.</li>
<li><strong>tagged</strong> A semi-colon delimited list of tags. Matching questions must have one or more of the given tags.</li>
<li><strong>nottagged</strong> A semi-colon delimited list of tags. Matching questions must not have any of the given tags.</li>
<li><strong>complete</strong> A function that is called when the results have been retrieved. A single parameter is given -- an instance of a <a href="http://api.stackoverflow.com/0.9/help/method?method=questions" target="_blank">questions result</a> as defined by the StackExchange API.</li></ul>
The return value is a context object that contains additional methods that operate on the future results. See the section on <i>chaining</i> for details.
<pre>
// find questions tagged 'asp.net' and 'javascript' but NOT 'jquery'
stackunderflow.searchQuestions(null, "asp.net;javascript", "jquery", function(result) {
    alert(result.questions.length);
});
</pre>
</p>

<a name="getQuestionsWithTags"></a>
<h2>stackunderflow.getQuestionsWithTags(tags, [optional]onlyUnanswered, [optional]complete(questions))</h2>
<p>
Searches for questions with all the given tags from the StackExchange API. 
<ul>
<li><strong>tags</strong> A semi-colon delimited list of tags. Matching questions must have ALL of the given tags.</li>
<li><strong>onlyUnanswered</strong> boolean -- true if you would like to restrict the search to questions with no up-voted answers.</li>
<li><strong>complete</strong> A function that is called when the results have been retrieved. A single parameter is given -- an instance of a <a href="http://api.stackoverflow.com/0.9/help/method?method=questions" target="_blank">questions result</a> as defined by the StackExchange API.</li></ul>
The return value is a context object that contains additional methods that operate on the future results. See the section on <i>chaining</i> for details.
<pre>
// find unanswered questions about jQuery
stackunderflow.getQuestionsWithTags("jquery", true, function(result) {
    alert(result.questions.length);
});
</pre>
</p>

<a name="getQuestionsByUser"></a>
<h2>stackunderflow.getQuestionsByUser(userIds, [optional]complete(questions))</h2>
<p>
Gets questions asked by the given user(s) by their user IDs.
<ul>
<li><strong>userIds</strong> A userId, an array of userIds, or a semi-colon delimited list of userIds.</li>
<li><strong>complete</strong> A function that is called when the results have been retrieved. A single parameter is given -- an instance of a <a href="http://api.stackoverflow.com/0.9/help/method?method=questions" target="_blank">questions result</a> as defined by the StackExchange API.</li></ul>
The return value is a context object that contains additional methods that operate on the future results. See the section on <i>chaining</i> for details.
<pre>
// find questions asked by InfinitiesLoop 
stackunderflow.getQuestionsByUser(110812, function(result) {
    alert(result.questions.length);
});
</pre>
</p>

<a name="renderQuestions"></a>
<h2>stackunderflow.render.questions(questions, target, template)</h2>
<p>
Renders the given questions result from the StackExchange API into the given target element, using the given HTML template.
<ul>
<li><strong>questions</strong> The questions to render, as an instance of a <a href="http://api.stackoverflow.com/0.9/help/method?method=questions" target="_blank">questions result</a> as defined by the StackExchange API. Note that this is NOT an array of questions, it contains meta information as well.</li>
<li><strong>target</strong> The DOM element to append the rendering to, or a DOM element id in the form "#id". Note that only ID selectors are supported if you use the string form.</li>
<li><strong>template</strong> The name of the HTML template to use to render the questions. Uses the "question" template by default. See the section on HTML templating for more details.</li></ul>
<pre>
// find unanswered questions about jQuery and render them
stackunderflow.getQuestionsWithTags("jquery", true, function(result) {
    stackunderflow.render.questions(result, "#questionContainer");
});

// or just use chaining
stackunderflow.getQuestionsWithTags("jquery", true).render("#questionContainer");
});

</pre>
Note that the rendering always <i>appends</i> to the given element with appendChild(). If you wish to clear previous results, set the innerHTML of the target element to blank first, or if using jQuery, use $().empty().
</p>

<a name="templating"></a>
<h1>HTML Templating</h1>
<p>
StackUnderflow.js uses very lightweight and simple HTML templating. You simply put placeholder tokens in the desired HTML that correspond to properties defined by the StackExchange API. The placeholder support filtering so you can customize how tokens are evaluated, allowing for simple but powerful techniques to customize the rendering.
</p>
<p>
When rendering questions, you have access to the entire object model defined by each question in a <a href="http://api.stackoverflow.com/0.9/help/method?method=questions" target="_blank">questions result</a> object. Your template may use all of this information, or little of it. You could, for example, have a simple template that just lists the titles of the questions.
</p>
<p>
<strong>Tokens</strong>
</p>
<p>
Tokens look like <strong>{name}</strong>, where "name" is the name of a property to read. For example, to get the title of a question, use <strong>{title}</strong>.
</p>
<p>
<strong>"." Notation</strong>
</p>
<p>
Tokens may pass through multiple levels of objects with the 'dot' notation. For example, to get to the question owner's name, use <strong>{owner.display_name}</strong>.
</p>
<p>
<strong>"=" Notation</strong>
</p>
<p>
If you would like to output the given value itself rather than a property of it, you may use <strong>{=}</strong>. For example, tags are given as an array of strings. When rendering the nested template for tags, each value is a string. The name of the tag then is output with {=}.
</p>
<p>
<strong>Special token {site}</strong>
</p>
<p>
You may use the {site} token at any time. It will be replaced with the current site setting on stackunderflow.site. This is important, for example, when building links to the exchange site, as urls given by the API are relative. For example, a question may be linked by the combination of these tokens: <strong>{site}{question_answers_url}</strong>
</p>

<p>
<strong>Using Filters</strong>
</p>
<p>
Often it is necessary to convert a piece of raw data into a more friendly format for display purposes. The StackExchange API, for example, returns dates in the Unix EPOCH form. This must be converted to a JavaScript date in a particular way. To use a filter, prefix a token with the name, followed by a colon: <strong>{filtername:token}</strong>.
</p>
<p>
Filters are defined on stackunderflow.filters. You may define your own. For example, this filter converts the value to upper case:
<pre>
stackunderflow.filters.upper = function(value) {
    return value.toString().toUpperCase();
}
</pre>
Note that the filter need not return something derived from the value itself. The value give could be the entire question, and the filter may read multiple values off the value to create a composite value. Also note that the token portion may be anything a normal token supports, including the "=" and "." notations.
</p>
<p>
There are several built-in filters.
<ul>
<li><strong>date</strong> Converts a StackExchange Epoch date into a string date of the form "yyyy-mm-dd". {date:last_activity_date}</li>
<li><strong>acceptedclass</strong> Given the answered or unanswered status of a question, returns the appropriate css class to use for the 'answers' count. &lt;span class="{acceptedclass:=}"&gt;&lt;/span&gt;</li>
<li><strong>ifdef</strong> If the value given is undefined, returns 'none'. Lets you hide a section of HTML if a value does not exist. For example, some questions have no owner. &lt;div style="display:{ifdef:owner}"&gt; ... &lt;/div&gt;</li>
</ul>
</p>

<p>
<strong>Nesting Templates</strong>
</p>
<p>
From within a template, if an object property is an array, you may render each item of the array using another template. For example, the default template for questions references the template for the array of tags associated with that question. Using a template looks like <strong>{template-name:obj}</strong>. The tags of a question are rendered using the 'tag' template, for example, as <strong>{template-tag:tags}</strong>. You may define your own templates.
</p>

<p>
<strong>Defining Templates</strong>
</p>
<p>
You can define templates using the stackunderflow.templates map and refer to them in the render() method by name. For example, this defines a simple template that lists question titles as list items.
<pre>
stackunderflow.templates.simple = "&lt;li&gt;{title}&lt;/li&gt;";
stackunderflow.getQuestionsWithTags("foo").render("#results", "simple");
</pre>
There are two templates included by default: question, and tag.
</p>

<a name="css"></a>
<h1>Customizing CSS</h1>
<p>
The default templates use CSS class names and HTML structure modeled after the way StackExchange renders a "question summary" page. You may use your own customized templates to change the structure and the CSS classes used. Or, you may customize the look by only changing how the CSS classes are defined.
</p>
<p>
StackUnderflow.js currently comes with one stylesheet -- stackoverflow.css -- named as such since it was made to look like StackOverflow.com. The background color was intentially left out to better merge with your existing site, but this may need to be customized depending on your sites color scheme. Each class name is exactly like the ones used by StackExchange except prefixed with 'se-' to provide uniqueness within your application. Also, all rules only apply while under an element with the 'se-question-summary' class.
</p>
<p>You may include any stylesheet you want instead of stackoverflow.css. Simply copy the CSS to your own website, and modify it to your hearts content. The HTML structure and CSS class names used by default are not documented here -- but you should easily be able to determine it by looking at the default template defined in StackUnderflow.js and the styles defined in StackOverflow.css.
</p>
