# tagcheck

Verify whether your `git+ssh://` dependencies are up to date.

## Usage

```bash
$ tagcheck
Retrieving tags...

package: git+ssh://git@github.com:foo/bar.git#v2.0.4
your version: v2.0.4  latest version: v2.0.4 OK

package: git+ssh://git@github.com:foo/baz.git#v1.1.3
your version: v1.1.3  latest version: v1.1.5 UPGRADE SUGGESTED

package: git+ssh://git@github.com:foo/foo.git#v1.2.8
your version: v1.2.8  latest version: v1.2.8 OK

package: git+ssh://git@github.com:foo/lol.git#v1.0.2
your version: v1.0.2  latest version: v1.0.2 OK

package: git+ssh://git@github.com:web/things.git#v2.0.1
your version: v2.0.1  latest version: v2.0.1 OK
```

## License

Copyright (c) 2014 Aleksey Smolenchuk <lxe@lxe.co>.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
