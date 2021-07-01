<?php
/*
Plugin Name: Cg English Hangman
Plugin URI: https://cyrilgouv.com/
Description: Learn english and play hangman on your wordpress website
Version: 1.0
Author: Cyril Gouv
Author URI: https://cyrilgouv.com/
License: MIT
Text Domain: cg-english-hangman
*/

if ( !defined( 'ABSPATH' ) ) {
    echo 'Calm down...';
    exit;
}

class CgEnglishHangman {
    public function __construct() {
        // Load Assets
        add_action( 'wp_enqueue_scripts', [ $this, 'load_assets' ] );
        // Shortcode
        add_shortcode( 'cg-english-hangman', [ $this, 'output' ] );
        // Words post type
        add_action( 'init', [ $this, 'words_custom_post_type' ] );
        // Register Words route
        add_action( 'rest_api_init', [ $this, 'register_rest_api' ] );
    }

    public function load_assets() {
        wp_enqueue_style( 'cg-english-hangman', plugin_dir_url( __FILE__ ) . '/css/cg-english-hangman.css' );
        wp_enqueue_script( 'cg-english-hangman', plugin_dir_url( __FILE__ ) . '/js/cg-english-hangman.js', [], '1.0.0', true );
    }

    public function words_custom_post_type() {
        $args = [
            'public' => true,
            'show_in_rest' => true,
            'archive' => false,
            'show_ui' => true,
            'supports' => ['title'],
            'capability' => 'manage_options',
            'publicly_queryable' => true,
            'labels' => [
                'name' => 'Words',
                'singular_name' => 'Word',
                'add_new_item' => 'Add a new word',
                'edit_item' => 'Edit word',
                'all_items' => 'All words'
            ],
            'menu_icon' => 'dashicons-welcome-write-blog'
        ];

        register_post_type( 'words', $args );
    }

    public function register_rest_api() {
        register_rest_route( 'ceh/v1', 'words', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_words' ]
        ] );
    }

    public function get_words() {
        $words_query = new WP_Query([
            'post_type' => 'words',
            'post_per_page' => -1
        ]);

        $results = [];

        while ( $words_query->have_posts() ):
            $words_query->the_post();
            array_push( $results, [
                'title' => get_the_title()
            ] );        
        endwhile;

        return $results;
    }

    public function output() {
        ?>
        <div id="cg-english-hangman" class="cg-english-hangman" data-url="<?= get_rest_url( null, 'ceh/v1/words' ) ?>">
            <h1 class="ceh-title">Hangman</h1>
            <p>Find the hidden word - Enter a letter</p>

            <div class="game-container">
                <svg height="250" width="200" class="figure-container">
                    <!-- Rod -->
                    <line x1="60" y1="20" x2="140" y2="20" />
                    <line x1="140" y1="20" x2="140" y2="50" />
                    <line x1="60" y1="20" x2="60" y2="230" />
                    <line x1="20" y1="230" x2="100" y2="230" />
                
                    <!-- Head -->
                    <circle cx="140" cy="70" r="20" class="figure-part" />

                    <!-- Body -->
                    <line x1="140" y1="90" x2="140" y2="150" class="figure-part" />

                    <!-- Arms -->
                    <line x1="140" y1="120" x2="120" y2="100" class="figure-part" />
                    <line x1="140" y1="120" x2="160" y2="100" class="figure-part" />

                    <!-- Legs -->
                    <line x1="140" y1="150" x2="120" y2="180" class="figure-part" />
                    <line x1="140" y1="150" x2="160" y2="180" class="figure-part" />
                </svg>

                <div class="wrong-letters-container">
                    <div id="wrong-letters"></div>
                </div>

                <div class="word" id="word"></div>
            </div>

            <!-- Container final message-->
            <div class="popup-container" id="popup-container">
                <div class="popup">
                    <h2 id="final-message"></h2>
                    <button id="play-button">Play Again</button>
                </div>
            </div>

            <!-- Notification -->
            <div class="notification-container" id="notification-container">
                <p>You have already entered this letter</p>
            </div>
        </div>
        <?php
    }
}

new CgEnglishHangman;