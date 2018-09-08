
const configs = {}
	
	//steem configs
	configs.steem_account = "adom";
	configs.steem_api = "https://api.steemit.com";
	configs.steem_app = "https://steemit.com/";
	//configs.steem_app = "https://busy.org/"; //to use busy.org
	//configs.steem_app = "https://steempeak.com/"; //to use steempeak.com
	configs.homepage_post_limit = 10;
	
	//social configs
	configs.facebook = "https://facebook.com/";
	configs.twitter = "https://twitter.com/";
	configs.linkedin = "https://linkedin.com/";
	configs.business = "https://www.peerquery.com/@" + configs.steem_account;
	

$( window ).on( "load", function() {
	
	$('#more').attr('href', configs.steem_app + '@' + configs.steem_account);
	
	//set extremal profile links
	$("#steemit-profile").attr('href', "https://steemit.com/@" + configs.steem_account);
	$("#busy-profile").attr('href', "https://busy.org/@" + configs.steem_account);
	$("#dtube-profile").attr('href', "https://d.tube/#!/c/" + configs.steem_account);
	$("#peerquery-profile").attr('href', "https://www.peerquery.com/@" + configs.steem_account);
	
	//follow button
	$("#follow-button").attr('href', configs.steem_app + "@" + configs.steem_account);
	
	//scroll animation
	$(".scroll").click(function(event){
		$('html, body').animate({scrollTop: '+=600px'}, 800);
	});
	
	// When the user scrolls down 20px from the top of the document, show the button
	window.onscroll = function() {scrollFunction()};
	
	function scrollFunction() {
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			document.getElementById("topBtn").style.display = "block";
		} else {
			document.getElementById("topBtn").style.display = "none";
		}
	}

	// When the user clicks on the button, scroll to the top of the document
	$('#topBtn').on("click", function topFunction() {
		$('html, body').animate({ scrollTop: 0 }, 1200);
			return false;
	});
	
  
    var client = new dsteem.Client(configs.steem_api);
    client.database.getDiscussions('blog', {tag: configs.steem_account, limit: configs.homepage_post_limit}).then(function(discussions){
		//console.log(discussions);
		for (var x in discussions) {
			create_post(discussions[x]);
		}
		
		$('#loader').hide();
		$('#more').show();
    });
	
	
	function create_post(post) {
	
		var row = document.createElement("div");
		row.className = "row";
		
			var twoColumn = document.createElement("div");
			twoColumn.className = "two columns";
		
				var img = document.createElement("img");
				img.src = first_img(post.body);
				img.style.width = "120px";
				
			twoColumn.appendChild(img);
		
		row.appendChild(twoColumn);
		
			var tenColumn = document.createElement("div");
			tenColumn.className = "ten columns";
		
				var row2 = document.createElement("div");
				row2.className = "row";
				
					var tenColumn2 = document.createElement("div");
					tenColumn2.className = "ten columns";
		
						var b = document.createElement("b");
						b.innerText = post.title;
				
					tenColumn2.appendChild(b);
				
				row2.appendChild(tenColumn2);
				
					var twoColumn2 = document.createElement("div");
					twoColumn2.className = "two columns";
				
						var small = document.createElement("small");
						small.innerText = new Date(post.created).toDateString();
					
					twoColumn2.appendChild(small);
				
				row2.appendChild(twoColumn2);
			
			tenColumn.appendChild(row2);
			
			var p = document.createElement("p");
				
				var span = document.createElement("span");
				span.innerText = parseText(post.body);
			
				var br = document.createElement("br");
			
				var a = document.createElement("a");
				a.href = configs.steem_app + post.category + "/@" + post.author + "/" + post.permlink;
				a.target = "_blank";
				a.innerText = "Continue reading";
			
				p.appendChild(span);
				p.appendChild(br);
				p.appendChild(a);
			
			tenColumn.appendChild(p);
		
		row.appendChild(tenColumn);
		
		document.getElementById('posts').appendChild(row);
		
	}
  
  
	function first_img(text) {
		
		try{
			var src = text.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|png|svg))/i)[0];
			if(src !== null || scr !== undefined) return src;
			return '/public/img/placeholder.png';
		} catch(err){
			//console.log(err);
			return 'public/img/placeholder.png';
		}
		
	}
  
  
	function parseText(html) {
		
		var md = new Remarkable({
			html: true, // Remarkable renders first then sanitize runs...
			breaks: false,
			linkify: false, // linkify is done locally
			typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
			quotes: '“”‘’',
		});
		
		//sanitze html before appending to  '#temp'
		var safeText = DOMPurify.sanitize(html);
		
		$('#temp').html(md.render(safeText));
		
		var htmlString = $("#temp").text();
		var stripedHtml = htmlString.replace(/<[^>]+>/g, '');
		var stripedNewline = stripedHtml.replace(/\r?\n|\r/g, ' ');
		var stripeImg = stripedNewline.replace(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/ig, '');
		var trimHtml = stripeImg.trim();
		
		$('#temp').html("");
		
		return trimHtml.substring(0, 200) + "... ";
		
	}
  
	
	
	
});

