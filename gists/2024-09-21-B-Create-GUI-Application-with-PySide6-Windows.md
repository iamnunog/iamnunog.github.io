1. **`basic/windows_1.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel("Another Window")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)
        self.setCentralWidget(self.button)

    def show_new_window(self: Self, checked: bool) -> None:
        w = AnotherWindow()
        w.show()


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/windows_1b.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel("Another Window")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)
        self.setCentralWidget(self.button)

    def show_new_window(self: Self, checked: bool) -> None:
        self.w = AnotherWindow()
        self.w.show()


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/windows_2.py`**

```python
from __future__ import annotations

import sys
from random import randint
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel(f"Another Window {randint(0, 100)}")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)
        self.setCentralWidget(self.button)

    def show_new_window(self: Self, checked: bool) -> None:
        self.w = AnotherWindow()
        self.w.show()


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/windows_3.py`**

```python
from __future__ import annotations

import sys
from random import randint
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel(f"Another Window {randint(0, 100)}")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.w = None

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)
        self.setCentralWidget(self.button)

    def show_new_window(self: Self, checked: bool) -> None:
        if self.w is None:
            self.w = AnotherWindow()
            self.w.show()


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/windows_4.py`**

```python
from __future__ import annotations

import sys
from random import randint
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel(f"Another Window {randint(0, 100)}")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.w = None

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)
        self.setCentralWidget(self.button)

    def show_new_window(self: Self, checked: bool) -> None:
        if self.w is None:
            self.w = AnotherWindow()
            self.w.show()
        else:
            self.w = None  # discard reference when window is closed


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/windows_4b.py`**

```python
from __future__ import annotations

import sys
from random import randint
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel(f"Another Window {randint(0, 100)}")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.w = None

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)
        self.setCentralWidget(self.button)

    def show_new_window(self: Self, checked: bool) -> None:
        if self.w is None:
            self.w = AnotherWindow()
            self.w.show()
        else:
            self.w.close()
            self.w = None  # discard reference when window is closed


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/windows_5.py`**

```python
from __future__ import annotations

import sys
from random import randint
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel(f"Another Window {randint(0, 100)}")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.w = AnotherWindow()

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)
        self.setCentralWidget(self.button)

    def show_new_window(self: Self, checked: bool) -> None:
        self.w.show()


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/windows_6.py`**

```python
from __future__ import annotations

import sys
from random import randint
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel(f"Another Window {randint(0, 100)}")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.w = AnotherWindow()

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)
        self.setCentralWidget(self.button)

    def show_new_window(self: Self, checked: bool) -> None:
        if self.w.isVisible():
            self.w.hide()
        else:
            self.w.show()


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/windows_7.py`**

```python

from __future__ import annotations

import sys
from random import randint
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QLineEdit,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class AnotherWindow(QWidget):
    # if parent is set to None it will appear as a floating window

    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout()
        self.label = QLabel(f"Another Window {randint(0, 100)}")

        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.w = AnotherWindow()

        self.button = QPushButton("Push for Window")
        self.button.clicked.connect(self.show_new_window)

        self.input = QLineEdit()
        self.input.textChanged.connect(self.w.label.setText)

        layout = QVBoxLayout()
        layout.addWidget(self.button)
        layout.addWidget(self.input)

        container = QWidget()
        container.setLayout(layout)

        self.setCentralWidget(container)

    def show_new_window(self: Self, checked: bool) -> None:
        if self.w.isVisible():
            self.w.hide()
        else:
            self.w.show()


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```
