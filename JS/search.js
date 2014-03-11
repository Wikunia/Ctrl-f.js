$(function(){   
    var content_id = "content";
    var content = '';
    
    $("#search_val").keydown(function(event){
		// on Enter
        if(event.keyCode == 13){
            // reset content 
            if(content != '') {
                $("#"+content_id).html(content);
            } else {
               content = $("#"+content_id).html(); 
            }
			intern_search($("#search_val").val());
		}
	})
    
    function intern_search(value) {
        // get the html text
        var html_content = $("#"+content_id).html();
        // split value into words
        var value_words = value.split(' ');
        var nr_words = value_words.length;
        
        // check if value is inside a html tag or not
        // if the first angle bracket is a '<' the value is outside of a html tag
        if (nr_words === 1) {
            var regex = new RegExp(value+'(?=[^>]*?(<|$))','gi');
        } else {
            // there can be a html tag between two words
            var regex = value_words[0]+'(?=[^>]*?(<|$))';
            for (var i = 1; i < nr_words; i++) {
               // there can be a space and a whole html tag between two parts 
               regex += '(?: ?)(?:<[^>]*?>)?(?: ?)'+value_words[i]+'(?=[^>]*?(<|$))';     
            }
            var regex = new RegExp(regex,'gi');
        }
        
        var matches = null;
        var positions = [], found = [], add_found_char = [];
        
        while(matches = regex.exec(html_content)) {
          // add this before / after a value part
          var start_tag = '<span class="found">';
          var end_tag = '</span>';
          // if the match contains html tags there need to be a </span>
          // before the html tag starts and a <span if the html tags closes again
           // abc <p>def => abc </span><p><span class="found">def</span>   
          var match = matches[0].replace(/>/g,'>'+start_tag);
          match = match.replace(/<(?!span class="found">)/g,end_tag+'<');
            
          // save the new match with correct html tags    
          found.push(match); 
          // save how many chars have been added 
          add_found_char.push(match.length-matches[0].length);
          // save found position
          positions.push(matches.index); 
        }
    
        
        var add_nr_chars = 0;
        var new_html_content = html_content;
        // iterate through all positions and add a span tag to mark the query
        for (var i = 0; i < positions.length; i++) {
            // add this before / after the found value
            var start_tag = '<span class="found" id="found_'+i+'">';
            var end_tag = '</span>';
            // string before value
            var content_before = new_html_content.substr(0,positions[i]+add_nr_chars);
            // value and start_tag and end_tag
            var value_and_tags = start_tag + found[i] + end_tag;
            // string after value
            var content_after = new_html_content.substr(positions[i]+add_nr_chars+found[i].length-add_found_char[i]);

            // number of characters which have been added
            add_nr_chars += start_tag.length + end_tag.length + add_found_char[i];
            
            // new content
            new_html_content = content_before + value_and_tags + content_after;
        }
        
        $("#"+content_id).html(new_html_content);                
    }
                                                                               
                                                                                              
})