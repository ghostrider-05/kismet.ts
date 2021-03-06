# Kismet.ts

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ghostrider-05/kismet.ts.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ghostrider-05/kismet.ts/context:javascript)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/ghostrider-05/kismet.ts)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ghostrider-05/kismet.ts/Tests?label=tests)][github]
[![Package version](https://img.shields.io/github/package-json/v/ghostrider-05/kismet.ts)][github]
![Code Climate coverage](https://img.shields.io/codeclimate/coverage/ghostrider-05/kismet.ts)
<!-- TODO: Add documentation ping badge -->

Build [kismet nodes][kismetUserGuide] for (the old and dusty) UDK using code! Intended for large .udk files to simplify the process of making kismet nodes

## Installation

Node 16.6.0 or newer is required.

```txt
npm install kismet.ts
```

### Links

- [Documentation][docs]
- [Changelog][changelog]
<!-- Web editor -->
<!-- Blender nodes -->

## Example

```ts
import { KismetFile } from 'kismet.ts'

const { Actions, Events, Variables } = KismetFile.Items

const targets = new Variables.Player()
    .setAllPlayers(true)

const DrawText = new Actions.DrawText()
    .setVariable('String', 'Hello world!')
    .setVariable('Target', targets)

const onMapLoaded = new Events.LevelLoaded()
    .on('Loaded and Visible', { item: DrawText })

const project = new KismetFile({ projectName: 'MyMap' })
const sequence = project.mainSequence

sequence.addItems([targets, onMapLoaded, DrawText])

console.log(sequence)
```

## Roadmap

For upcoming features take a look at the [roadmap][roadmap]. Discussion and other questions can also be asked in [GitHub discussions][gh-discussions]

[docs]: https://github.com/ghostrider-05/kismet.code/tree/master/docs
[changelog]: https://github.com/ghostrider-05/kismet.code/tree/master/CHANGELOG.md
[kismetUserGuide]: https://docs.unrealengine.com/udk/Three/KismetUserGuide.html
[github]: https://github.com/ghostrider-05/kismet.code
[gh-discussions]: https://github.com/ghostrider-05/kismet.code/discussions
[roadmap]: https://github.com/users/ghostrider-05/projects/2/views/1
