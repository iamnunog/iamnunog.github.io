1. **`basic/widgets_3.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QMainWindow,
    QWidget,
)

CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QCheckBox("this is a checkbox")
        widget.setCheckState(Qt.Checked)
        widget.stateChanged.connect(self.show_state)

        self.setCentralWidget(widget)

    def show_state(self: Self, state) -> None:
        print(state == Qt.Checked.value)
        print(state, Qt.Checked.value)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_4.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QMainWindow,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QComboBox()
        widget.addItems(["One", "Two", "Three"])

        widget.currentIndexChanged.connect(self.index_changed)
        widget.currentTextChanged.connect(self.text_changed)

        self.setCentralWidget(widget)

    def index_changed(self: Self, i: int) -> None:
        print(i)

    def text_changed(self: Self, s: str) -> None:
        print(s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_5.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QListWidget()
        widget.addItems(["One", "Two", "Three"])

        widget.currentItemChanged.connect(self.index_changed)
        widget.currentTextChanged.connect(self.text_changed)

        self.setCentralWidget(widget)

    def index_changed(self: Self, i: QListWidgetItem) -> None:
        print(i)

    def text_changed(self: Self, s: str) -> None:
        print(s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_6.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QLineEdit()
        widget.setMaxLength(10)
        widget.setPlaceholderText("Enter your text")

        widget.returnPressed.connect(self.return_pressed)
        widget.selectionChanged.connect(self.selection_changed)
        widget.textChanged.connect(self.text_changed)
        widget.textEdited.connect(self.text_edited)

        self.setCentralWidget(widget)

    def return_pressed(self: Self) -> None:
        print("Return pressed!")
        self.centralWidget().setText("BOOM!")

    def selection_changed(self: Self) -> None:
        print("Selection changed")
        print(self.centralWidget().selectedText())

    def text_changed(self: Self, s: str) -> None:
        print("Text changed...")
        print(s)

    def text_edited(self: Self, s: str) -> None:
        print("Text edited...")
        print(s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_7.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QSpinBox,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QSpinBox()
        widget.setMinimum(-10)
        widget.setMaximum(3)

        widget.setPrefix("$")
        widget.setSuffix("c")
        widget.setSingleStep(3)

        widget.valueChanged.connect(self.value_changed)
        widget.textChanged.connect(self.value_changed_str)
        self.setCentralWidget(widget)

    def value_changed(self: Self, i: int) -> None:
        print(i)

    def value_changed_str(self: Self, s: str) -> None:
        print(s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_8.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QSlider,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QSlider()
        widget.setMinimum(-10)
        widget.setMaximum(3)
        widget.setSingleStep(3)

        widget.setOrientation(Qt.Horizontal)

        widget.valueChanged.connect(self.value_changed)
        widget.sliderMoved.connect(self.slider_position)
        widget.sliderPressed.connect(self.slider_pressed)
        widget.sliderReleased.connect(self.slider_released)

        self.setCentralWidget(widget)

    def value_changed(self: Self, i: int) -> None:
        print(i)

    def slider_position(self: Self, p: int) -> None:
        print("position", p)

    def slider_pressed(self: Self) -> None:
        print("Pressed!")

    def slider_released(self: Self) -> None:
        print("Released")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_9.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QDial,
    QMainWindow,
    QSlider,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QDial()
        widget.setRange(-10, 100)
        widget.setSingleStep(1)

        widget.valueChanged.connect(self.value_changed)
        widget.sliderMoved.connect(self.slider_position)
        widget.sliderPressed.connect(self.slider_pressed)
        widget.sliderReleased.connect(self.slider_released)

        self.setCentralWidget(widget)

    def value_changed(self: Self, i: int) -> None:
        print(i)

    def slider_position(self: Self, p: int) -> None:
        print("position", p)

    def slider_pressed(self: Self) -> None:
        print("Pressed!")

    def slider_released(self: Self) -> None:
        print("Released")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

