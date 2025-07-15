Simple script to configure a CLI from a YAML configuration. 

**`yaml_to_cli.py`**

```python
import click
from click.decorators import argument, command, option
from ruamel.yaml import YAML

from pathlib import Path

type_map = {
    "str": click.STRING,
    "int": click.INT,
    "float": click.FLOAT,
    "bool": click.BOOL,
    "path": click.Path,
    "choice": click.Choice,
}


@click.group()
@click.version_option(
    version="0.1", prog_name="click_from_yaml", message=("%(prog)s %(version)s")
)
@click.pass_context
def click_from_yaml_cli(ctx):
    ...


@click_from_yaml_cli.command(
    context_settings=dict(
        ignore_unknown_options=True,
        allow_extra_args=True,
    )
)
@click.argument("project")
@click.argument("playbook")
@click.option("-c", "--config", "config")
@click.pass_context
def run(ctx, project, playbook, config):
    
    print(config)
    print(ctx.args)

    yaml = YAML(typ="safe")
    data = yaml.load(open(config).read())
    print(data)

    if not data["project"] == project:
        raise Exception("Not the project")

    help = f"Options for {data['project']}"
    group = click.Group(
        name=data["project"],
        help=help,
        context_settings=dict(help_option_names=["--playbook-help"]),
    )

    params = []

    def proc_type(cfg):
        if cfg.get("type", "str") == "choice":
            return type_map["choice"](option_cfg.get("options", []))

        return type_map[cfg.get("type", "str")]

    for arg in data["play"][playbook]["arguments"]:
        arg_cfg = data["play"][playbook]["arguments"]
        params.append(click.Argument([arg], type=proc_type(arg_cfg), required=True))

    for option in data["play"][playbook]["options"].keys():
        option_cfg = data["play"][playbook]["options"][option]

        param_decls = []

        if option_cfg.get("short", ""):
            param_decls.append(option_cfg["short"])

        if option_cfg.get("long", ""):
            param_decls.append(option_cfg["long"])

        if type_map[option_cfg.get("type", "str")] == click.BOOL:
            param_decls.append(f"{option_cfg['on']}/{option_cfg['off']}")
            print(param_decls)

        params.append(
            click.Option(
                param_decls=param_decls,
                help=option_cfg["help"],
                required=option_cfg.get("required", False),
                multiple=option_cfg.get("multiple", False),
                is_flag=type_map[option_cfg.get("type", "str")] == click.BOOL,
                type=proc_type(option_cfg),
            )
        )

    def cmd_callback(**kwargs):
        print(args)
        print(kwargs)
        print("call back")

    command = click.Command(
        name=playbook,
        params=params,
        callback=cmd_callback,
        help=data["play"][playbook]["help"],
    )

    group.add_command(command)

    args = " ".join([playbook] + ctx.args)
    print(args)

    group([playbook] + ctx.args)


def main():
    """The entry that CLI is executed from"""
    try:
        click_from_yaml_cli(obj={})
    except Exception as e:
        click.secho(f"ERROR: {e}", bold=True, fg="red")
        exit(1)


if __name__ == "__main__":
    main()
```

**`example-cli.yaml`**

```yaml
project: abc

play:
  thisisatest:
    help: >
      this is a play
    options:
      op1:
        help: "option number 1"
        short: -o
        long: --option1
        type: str
        required: True

      op2:
        help: "option number 2"
        long: --option2
        multiple: true
        type: choice
        options:
        - dev
        - prod
        - qa

      boolflag:
        help: "bool flag"
        on: --shout
        off: --no-shout
        type: bool
        is_flag: true
        default: True

    arguments:
      environment:
        type: string
```
