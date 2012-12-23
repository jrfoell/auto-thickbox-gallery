<?php
/*
Plugin Name: Auto Thickbox Gallery
Description: Creates a thickbox gallery out of media in a post
Author: Justin Foell
Version: 1.1
Author URI: http://www.foell.org/justin
*/

class AutoThickboxGallery {
  	
	public function onInit() {
		add_filter( 'image_send_to_editor', array( $this, 'filterImageSend' ), 10, 8 );
		add_action( 'the_post', array( $this, 'onThePost' ) );
		add_filter( 'mce_external_plugins', array( $this, 'filterExtMCEPlugins' ) );
	}

	public function filterExtMCEPlugins( $plugins ) {
		$plugins['autotbgallery'] = plugins_url( '/js/editor_plugin.js',  __FILE__ );
		return $plugins;
	}
	
	public function filterImageSend( $html, $id, $caption, $title, $align, $url, $size, $alt ) {
		$title = $caption ? "title=\"{$caption}\" " : '';
		return str_replace( '<a href', "<a class=\"thickbox\" rel=\"gallery-{$_POST['post_id']}\" {$title}href", $html );
	}
	
	public function onThePost( $post ) {
		if ( preg_match( '/<a class="thickbox"[\s]+[^>]*?rel=[\'"]gallery-/', $post->post_content ) ) {
			wp_enqueue_style( 'thickbox' );
			wp_enqueue_script( 'thickbox' );
		}
	}
}

$tbgal_plugin = new AutoThickboxGallery();
add_action( 'init', array( $tbgal_plugin, 'onInit' ) );
