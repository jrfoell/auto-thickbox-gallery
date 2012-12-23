(function() {
	tinymce.create('tinymce.plugins.autoTBGallery', {
		/**
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			var that = this;
	
			//this will run after wpEditImage
			ed.onPostProcess.add(function(ed, o) {
				if (o.get)
					o.content = that._get_shcode(o.content);
			});

		},

		//look for the caption shortcode and modify it
		_get_shcode : function(co) {
			if ( co.match(/\[(?:wp_)?caption/) ) {
				co = co.replace(/(?:<p>)?\[(?:wp_)?caption([^\]]+)\]([\s\S]+?)\[\/(?:wp_)?caption\](?:<\/p>)?/g, function(a,b,c){
					var id, cls, w, cap, div_cls, img, trim = tinymce.trim;
				
					id = b.match(/id=['"]([^'"]*)['"] ?/);
					if ( id )
						b = b.replace(id[0], '');

					cls = b.match(/align=['"]([^'"]*)['"] ?/);
					if ( cls )
						b = b.replace(cls[0], '');

					w = b.match(/width=['"]([0-9]*)['"] ?/);
					if ( w )
						b = b.replace(w[0], '');

					c = trim(c);
					img = c.match(/((?:<a [^>]+>)?<img [^>]+>(?:<\/a>)?)([\s\S]*)/i);

					if ( img && img[2] ) {
						cap = trim( img[2] );
						img = trim( img[1] );
					} else {
						// old captions shortcode style
						cap = trim(b).replace(/caption=['"]/, '').replace(/['"]$/, '');
						img = c;
					}

					//match the title in the href,not the img
					title = c.match(/<a[\s]+[^>]*?title="([^"]+)/i);

					id = ( id && id[1] ) ? id[1] : '';
					cls = ( cls && cls[1] ) ? cls[1] : 'alignnone';
					w = ( w && w[1] ) ? w[1] : '';
					title = ( title && title[1] ) ? title[1] : '';
					//remove title from the href if neccessary
					if ( ! cap && title )
						c = c.replace(/[\s]+title="[^"]+"/i, '');

					if ( ! w || ! cap ) return c;
					if ( cap ) {
						if ( title ) //only replace the first instance (href, not img)
							img = img.replace(/title="[^"]+"/i, 'title="'+cap+'"');
						else
							img = img.replace(/href=/i, 'title="'+cap+'" href=');
					}
	
					return '[caption id="'+id+'" align="'+cls+'" width="'+w+'"]'+img+' '+cap+'[/caption]';
				});
			} 

			if ( co.match(/[^\]]<a class="thickbox" [^>]*?title="[^"]+"[^>]*?><img/g) ) {
				//raw href w/ title & no caption, remove title
				co = co.replace(/([^\]])<a class="thickbox" ([^>]*?)title="[^"]+" ([^>]*?)><img/g, function(full_str, match1, match2, match3) {
					return match1 + '<a class="thickbox" ' + match2 + match3 + '><img';
				});
			}
			return co;
		},

		getInfo : function() {
			return {
				longname : 'Edit ThickBox Gallery Caption/Title',
				author : 'Justin Foell',
				authorurl : 'http://www.foell.org/justin',
				infourl : '',
				version : '1.1'
			};
		}
	});

	tinymce.PluginManager.add('autotbgallery', tinymce.plugins.autoTBGallery);

})();
