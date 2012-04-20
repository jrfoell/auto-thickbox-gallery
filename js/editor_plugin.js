(function() {
	tinymce.create('tinymce.plugins.autoTBGallery', {
		/**
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			var t = this;
	
			//this will run after wpEditImage
			ed.onPostProcess.add(function(ed, o) {
				if (o.get)
					o.content = t._get_shcode(o.content);
			});
		},

		//look for the caption shortcode and modify it
		_get_shcode : function(co) {
			if ( co.match(/\[(?:wp_)?caption/) ) {
			return co.replace(/(?:<p>)?\[(?:wp_)?caption([^\]]+)\]([\s\S]+?)\[\/(?:wp_)?caption\](?:<\/p>)?[\s\u00a0]*/g, function(a,b,c){
				var id, cls, w, cap, div_cls;
				
				b = b.replace(/\\'|\\&#39;|\\&#039;/g, '&#39;').replace(/\\"|\\&quot;/g, '&quot;');
				c = c.replace(/\\&#39;|\\&#039;/g, '&#39;').replace(/\\&quot;/g, '&quot;');
				id = b.match(/id=['"]([^'"]+)/i);
				cls = b.match(/align=['"]([^'"]+)/i);
				w = b.match(/width=['"]([0-9]+)/);
				cap = b.match(/caption=['"]([^'"]+)/i);
				//match the title in the href,not the img
				title = c.match(/<a[\s]+[^>]*?title=['"]([^'"]+)/i);

				id = ( id && id[1] ) ? id[1] : '';
				cls = ( cls && cls[1] ) ? cls[1] : 'alignnone';
				w = ( w && w[1] ) ? w[1] : '';
				cap = ( cap && cap[1] ) ? cap[1] : '';
				title = ( title && title[1] ) ? title[1] : '';
				//remove title from the href if neccessary
				if ( ! cap && title ) {
					c = c.replace(/[\s]+title=['"][^'"]+['"]/i, '');
				}
				if ( ! w || ! cap ) return c;
				if ( cap ) {
					if ( title ) //only replace the first instance (href, not img)
						c = c.replace(/title=['"][^'"]+['"]/i, 'title="'+cap+'"');
					else
						c = c.replace(/href=/i, 'title="'+cap+'" href=');
				}

				return '[caption id="'+id+'" align="'+cls+'" width="'+w+'" caption="'+cap+'"]'+c+'[/caption]';
			});
			} else {
				//raw href w/ title & no caption, remove title
				title = co.match(/<a[\s]+[^>]*?title=['"]/i);
				if ( title )
					return co.replace(/[\s]+title=['"][^'"]+['"]/i, '');
			}
			return co;
		},

		getInfo : function() {
			return {
				longname : 'Edit ThickBox Gallery Caption/Title',
				author : 'Justin Foell',
				authorurl : 'http://www.foell.org/justin',
				infourl : '',
				version : '1.0'
			};
		}
	});

	tinymce.PluginManager.add('autotbgallery', tinymce.plugins.autoTBGallery);

})();