
(function() {

// some API urls
var google = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&callback={callback}&rsz=large&q={query}",
    questions = "http://api.stackoverflow.com/1.0/questions/{id}?key={key}&jsonp={callback}",
    questionsTagged = "http://api.stackoverflow.com/1.0/questions/?key={key}&tagged={tagged}&jsonp={callback}",
    search = "http://api.stackoverflow.com/1.0/search/?key={key}&intitle={intitle}&nottagged={nottagged}&tagged={tagged}&jsonp={callback}",
    unansweredQuestionsTagged = "http://api.stackoverflow.com/1.0/questions/unanswered/?key={key}&tagged={tagged}&jsonp={callback}",
    questionsByUser = "http://api.stackoverflow.com/1.0/users/{id}/questions?key={key}&jsonp={callback}",
    // prevent loading more than once
    isLoaded,
    // each call creates a unique jsonp callback
    jsonpCount = 0,
    // for matching the question id inside a stackexchange question url
    regexQuestion = /\/questions\/([0-9]*)\//ig,
    // those listening for the loaded event
    callbacks = [];

function domLoaded() {
    // based on the proven method of simulating DOMContentLoaded in IE
    if (window.addEventListener) {
        window.addEventListener("load", loaded, false);
    }
    else {
        window.attachEvent("onload", loaded);
    }
    var check;
    if (window.attachEvent) {
        if ((window == window.top) && document.documentElement.doScroll) {
            var timeout, er, el = document.createElement("div");
            check = function() {
                try {
                    el.doScroll("left");
                }
                catch (er) {
                    timeout = window.setTimeout(check, 0);
                    return;
                }
                el = null;
                loaded();
            }
            check();
        }
        else {
            document.onreadystatechange = function() {
                if (/loaded|complete/.test(document.readyState)) {
                    loaded();
                }
            };
        }
    }
    else if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", loaded, false);
    }
}
            
function loaded() {
    // called when the DOM is ready
    if (!isLoaded) {
        isLoaded = true;
        for (var i = 0, l = callbacks.length; i < l; i++) {
            callbacks[i]();
        }
    }
}

function jsonp(url, params, callback) {
    // begin a jsonp request and foward the response
    var jsonp = "_jsonp" + jsonpCount++;
    url = url
        .replace("{callback}", "stackunderflow." + jsonp)
        .replace("{key}", su.appId);
    if (params) {
        for (var name in params) {
            url = url.replace("{" + name + "}", params[name]);
        }
    }
    su[jsonp] = function(data) {
        delete su[jsonp];
        su.loaded(function() {
            callback(data);
        });
    };
    var scr = document.createElement("script");
    scr.type = "text/javascript";
    scr.src = url;
    // insertBefore in case this is performed inline in the head
    var head = document.getElementsByTagName("head")[0];
    head.insertBefore(scr, head.firstChild);
}

function getUniqueQuestions(searchResults) {
    // created an array of unique question ids
    // from a set of google search results
    var questions = [], index = {};
    for (var i = 0, l = searchResults.length; i < l; i++) {
        regexQuestion.lastIndex = 0;
        var url = searchResults[i].unescapedUrl,
            match = regexQuestion.exec(url);
        if ( match && match[1] ) {
            var questionId = parseInt(match[1]);
            if (!index[questionId]) { 
                questions.push(questionId);
                index[questionId] = 1;
            }
        }
    }
    return questions;
}

function pad(num) {
    var s = num+"";
    return s.length === 2 ? s : ("0" + s);
}
function applyTemplate(html, obj) {
    var i, l, regexTokens = new RegExp("\\{([^}]*)\\}", "g"), match, token,
        tokenValues = {
            site: su.site
        };
    do {
        match = regexTokens.exec(html);
        token = match ? match[1] : null;
        if (token) {
            var index = token.indexOf(":"),
                filter = null;
            if (index > -1) {
                filter = token.substr(0, index);
                token = token.substr(index + 1);
            }
            var parts = token === "=" ? [] : token.split('.'),
                step = obj;
            for (var i = 0, l = parts.length; i < l; i++) {
                step = step[parts[i]];
                if (typeof step === "undefined") break;
            }
            if (filter) {
                var template;
                if (filter.indexOf("template-") > -1) {
                    template = filter.substr("template-".length);
                    filter = "template";
                }
                filter = su.filters[filter];
                if (filter) {
                    step = filter(step, template);
                }
            }
            if (typeof step !== "undefined") {
                tokenValues[match[1]] = step;
            }
        }
    }
    while (token);
    for (token in tokenValues) {
        html = html.replace(new RegExp("\\{" + token.replace(/([\.\:\-])/g, '\\$1') + "\\}","g"), tokenValues[token]);
    }
    return html;
}

function append(target, html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    while(div.firstChild) {
        target.appendChild(div.firstChild);
    }
}

function execQuestions(url, params, complete) {
    var renderArgs,
        ctx = { render: function() { renderArgs = arguments; } };
    jsonp(url, params, function(questions) {
        if (complete) complete(questions);
        if (renderArgs) {
            renderArgs = Array.prototype.slice.apply(renderArgs);
            renderArgs.splice(0, 0, questions);
            su.render.questions.apply(null, renderArgs);
        }
    });
    return ctx;
}

var su = window.stackunderflow = {
    appId: "oxXcnoD51kKE-crj7TadaA",
    site: "http://stackoverflow.com",
    loaded: function(callback) {
        if (isLoaded) {
            callback();
        }
        else {
            callbacks.push(callback);
        }
    },
    googleQuestions: function(term, complete) {
        var renderArgs,
            ctx = { render: function() { renderArgs = arguments; } };
        var site = su.site + "/questions";
        term = term || ('"' + window.location + '"');
        jsonp(google, {
            query: "site:" + site + " " + term
        },
        function(data) {
            var questions = getUniqueQuestions(data.responseData.results);
            if (questions.length) {
                su.getQuestions(questions, function(questions) {
                    if (complete) complete(questions);
                    if (renderArgs) {
                        renderArgs = Array.prototype.slice.apply(renderArgs);
                        renderArgs.splice(0, 0, questions);
                        su.render.questions.apply(null, renderArgs);
                    }
                });
            }
        });
        return ctx;
    },
    getQuestions: function(questionIds, complete) {
        return execQuestions(questions, { id: questionIds.join(';') }, complete);
    },
    searchQuestions: function(intitle, tagged, notTagged, complete) {
        return execQuestions(search, { tagged: tagged, nottagged: notTagged, intitle: intitle }, complete);
    },    
    getQuestionsWithTags: function(tags, onlyUnanswered, complete) {
        return execQuestions(onlyUnanswered ? unansweredQuestionsTagged : questionsTagged,
            { tagged: tags }, complete);
    },
    getQuestionsByUser: function(userIds, complete) {
        return execQuestions(questionsByUser, { id: userIds instanceof Array ? userIds.join(';') : userIds }, complete);
    },    
    render: {
        questions: function(questions, target, template) {
            template = template || "question";
            if (typeof target === "string") {
                if (target.charAt(0) === "#") target = target.substr(1);
                target = document.getElementById(target);
            }
            var html = "";
            questions = questions.questions;
            if (questions) {
                for (var i = 0, l = questions.length; i < l; i++) {
                    html += applyTemplate(su.templates[template], questions[i]);
                }
            }
            append(target, html);
        }
    },
    templates: {
        tag: '<a href="{site}/questions/tagged/{=}" class="se-post-tag" title="show questions tagged \'{=}\'" rel="tag">{=}</a> ',
        question: '<div class="se-question-summary" id="question-summary-{question_id}"> \
    <div onclick="window.location.href=\'{site}{question_answers_url}\'" class="se-cp"> \
        <div class="se-votes"> \
            <div class="se-mini-counts">{up_vote_count}</div> \
            <div>votes</div> \
        </div> \
        <div class="se-status {acceptedclass:=}"> \
            <div class="se-mini-counts">{answer_count}</div>\
            <div>answer</div> \
        </div> \
        <div class="se-views"> \
            <div class="se-mini-counts">{view_count}</div> \
            <div>views</div> \
        </div> \
    </div> \
    <div class="se-summary"> \
        <h3><a href="{site}{question_answers_url}" class="se-question-hyperlink" title="{title}">{title}</a></h3> \
        <div class="se-tags"> \
            {template-tag:tags}\
        </div> \
        <div class="se-started"> \
            <span class="se-relativetime">{date:last_activity_date}</span> \
            <a style="display:{ifdef:owner}" href="{site}/users/{owner.user_id}/{owner.display_name}">{owner.display_name}</a> <span style="display:{ifdef:owner}"  class="se-reputation-score" title="reputation score">{owner.reputation}</span> \
        </div> \
    </div> \
</div> '
    },
    filters: {
        date: function(value) {
            var date = new Date(parseInt(value)*1000);
            return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate());
        },
        template: function(value, templateName) {
            var template = su.templates[templateName],
                html = "";
            if (template) {
                for (i = 0, l = value.length; i < l; i++) {
                    html += applyTemplate(template, value[i]);
                }
            }
            return html;
        },
        acceptedclass: function(value) {
            return value.accepted_answer_id ? "se-answered-accepted" :
                (value.answers && value.answers.length ? "se-answered" : "se-unanswered");
        },
        ifdef: function(value) {
            return typeof value === "undefined" ? "none" : "";
        }
    }
};

domLoaded();

})();
