/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Richeve Siodina Bebedor

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"packageName": "git-get-current-branch",
			"fileName": "git-get-current-branch.js",
			"moduleName": "gitGetCurrentBranchList",
			"authorName": "Richeve S. Bebedor",
			"authorEMail": "richeve.bebedor@gmail.com",
			"repository": "git@github.com:volkovasystems/git-get-local-branch-list.git",
			"isGlobal": "true"
		}
	@end-module-configuration

	@module-documentation:
		
	@end-module-documentation

	@include:
		{
			"work@github.com/volkovasystems": "work",
			"git-exists@github.com/volkovasystems": "gitExists",
			"fs@nodejs": "fs"
		}
	@end-include
*/
var gitGetCurrentBranch = function gitGetCurrentBranch( repositoryDirectory, callback ){
	/*:
		@meta-configuration:
			{
				"repositoryDirectory:required": "string",
				"callback": "Callback"
			}
		@end-meta-configuration
	*/

	var currentWorkingDirectory = process.cwd( );

	if( GIT_GET_CURRENT_BRANCH_DIRECTORY_PATTERN.test( currentWorkingDirectory ) ){
		process.chdir( "../" );
	}

	if( repositoryDirectory && 
		fs.existsSync( repositoryDirectory ) &&
		fs.statSync( repositoryDirectory ).isDirectory( ) )
	{
		process.chdir( repositoryDirectory );

	}else{
		console.warn( "this error is shown for warning purposes only" );
		var error = new Error( "repository directory is invalid" );
		console.error( error );
		console.warn( "reverting to using the parent directory of this module as the repository directory" ); 
	}

	gitExists( repositoryDirectory,
		function onGitExists( error, isExisting ){
			if( error ){
				callback( error, [ ] );
				
			}else if( isExisting ){
				work( "git branch",
					function onGitBranch( error, isValid, output ){
						if( error ){
							console.error( error );
							callback( error, [ ] );

						}else if( isValid ){
							output = output.trim( );
							var resultList = output.split( NEW_LINE_PATTERN );

							var currentBranch = "";
							while( 
								currentBranch = resultList.pop( ),
								CURRENT_BRANCH_PATTERN.test( currentBranch ) ? 
									( 
										currentBranch = currentBranch.replace( CURRENT_BRANCH_PATTERN, "" ),
										resultList = [ ], 
										resultList.length 
									) : 
									resultList.length
							);

							callback( null, currentBranch );

						}else{
							var error = new Error( "fatal:undetermined result" );
							console.error( error );
							callback( error, [ ] );
						}
					} );

			}else{
				var error = new Error( "given git repository directory does not exists" );
				console.error( error );
				callback( error, [ ] );
			}
		} );
};

const GIT_GET_CURRENT_BRANCH_DIRECTORY_PATTERN = /git-get-current-branch$/;
const NEW_LINE_PATTERN = /\n(?:\s*)?/;
const CURRENT_BRANCH_PATTERN = /^\*\s*/;

var work = require( "./work/work.js" );
var gitExists = require( "./git-exists/git-exists.js" );
var fs = require( "fs" );

module.exports = gitGetCurrentBranch;

gitGetCurrentBranch( "./git-exists",
	function onGitGetCurrentBranch( error, currentBranch ){
		console.log( currentBranch );
	} );