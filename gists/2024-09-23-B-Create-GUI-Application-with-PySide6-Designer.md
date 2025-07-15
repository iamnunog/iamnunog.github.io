1. **`designer/mainwindow.ui`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>MainWindow</class>
 <widget class="QMainWindow" name="MainWindow">
  <property name="geometry">
   <rect>
    <x>0</x>
    <y>0</y>
    <width>403</width>
    <height>324</height>
   </rect>
  </property>
  <property name="windowTitle">
   <string>MainWindow</string>
  </property>
  <widget class="QWidget" name="centralwidget">
   <widget class="QWidget" name="verticalLayoutWidget">
    <property name="geometry">
     <rect>
      <x>1</x>
      <y>0</y>
      <width>401</width>
      <height>281</height>
     </rect>
    </property>
    <layout class="QVBoxLayout" name="verticalLayout">
     <item>
      <widget class="QLabel" name="label">
       <property name="maximumSize">
        <size>
         <width>399</width>
         <height>249</height>
        </size>
       </property>
       <property name="text">
        <string>TextLabel</string>
       </property>
      </widget>
     </item>
     <item>
      <widget class="QPushButton" name="pushButton">
       <property name="text">
        <string>PushButton</string>
       </property>
      </widget>
     </item>
    </layout>
   </widget>
  </widget>
  <widget class="QMenuBar" name="menubar">
   <property name="geometry">
    <rect>
     <x>0</x>
     <y>0</y>
     <width>403</width>
     <height>21</height>
    </rect>
   </property>
  </widget>
  <widget class="QStatusBar" name="statusbar"/>
 </widget>
 <resources/>
 <connections/>
</ui>
```

```bash
$ pyside6-uic .\designer\mainwindow.ui -o MainWindow.py
```

```python
################################################################################
## Form generated from reading UI file 'mainwindow.ui'
##
## Created by: Qt User Interface Compiler version 6.7.2
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide6.QtCore import QCoreApplication, QMetaObject, QRect, QSize
from PySide6.QtWidgets import (
    QLabel,
    QMenuBar,
    QPushButton,
    QStatusBar,
    QVBoxLayout,
    QWidget,
)


class Ui_MainWindow:
    def setupUi(self, MainWindow):
        if not MainWindow.objectName():
            MainWindow.setObjectName("MainWindow")
        MainWindow.resize(403, 324)
        self.centralwidget = QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")
        self.verticalLayoutWidget = QWidget(self.centralwidget)
        self.verticalLayoutWidget.setObjectName("verticalLayoutWidget")
        self.verticalLayoutWidget.setGeometry(QRect(1, 0, 401, 281))
        self.verticalLayout = QVBoxLayout(self.verticalLayoutWidget)
        self.verticalLayout.setObjectName("verticalLayout")
        self.verticalLayout.setContentsMargins(0, 0, 0, 0)
        self.label = QLabel(self.verticalLayoutWidget)
        self.label.setObjectName("label")
        self.label.setMaximumSize(QSize(399, 249))

        self.verticalLayout.addWidget(self.label)

        self.pushButton = QPushButton(self.verticalLayoutWidget)
        self.pushButton.setObjectName("pushButton")

        self.verticalLayout.addWidget(self.pushButton)

        MainWindow.setCentralWidget(self.centralwidget)
        self.menubar = QMenuBar(MainWindow)
        self.menubar.setObjectName("menubar")
        self.menubar.setGeometry(QRect(0, 0, 403, 21))
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)

        QMetaObject.connectSlotsByName(MainWindow)

    # setupUi

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(
            QCoreApplication.translate("MainWindow", "MainWindow", None),
        )
        self.label.setText(
            QCoreApplication.translate("MainWindow", "TextLabel", None),
        )
        self.pushButton.setText(
            QCoreApplication.translate("MainWindow", "PushButton", None),
        )

    # retranslateUi
```

1. **`designer/example_1.py`**

```python
import sys
from pathlib import Path

from PySide6 import QtWidgets
from PySide6.QtUiTools import QUiLoader

CURRENT_PATH = Path(__file__).parent

loader = QUiLoader()

app = QtWidgets.QApplication(sys.argv)
window = loader.load(CURRENT_PATH / "mainwindow.ui", None)
window.show()
app.exec()
```

1. **`designer/example_2.py`**

```python
import sys
from pathlib import Path

from PySide6 import QtWidgets
from PySide6.QtWidgets import QMainWindow
from PySide6.QtUiTools import QUiLoader

CURRENT_PATH = Path(__file__).parent

loader = QUiLoader()


def mainwindow_setup(window: QMainWindow) -> None:
    window.setWindowTitle("MainWindow Title")


app = QtWidgets.QApplication(sys.argv)
window = loader.load(CURRENT_PATH / "mainwindow.ui", None)
mainwindow_setup(window)
window.show()
app.exec()
```

1. **`designer/example_3.py`**

```python
import sys
from pathlib import Path
from typing import Self

from PySide6 import QtCore, QtWidgets
from PySide6.QtUiTools import QUiLoader

CURRENT_PATH = Path(__file__).parent

loader = QUiLoader()


class MainUI(QtCore.QObject):
    def __init__(self: Self) -> None:
        super().__init__()
        self.ui = loader.load(CURRENT_PATH / "mainwindow.ui", None)
        self.ui.setWindowTitle("MainWindow Title")
        self.ui.show()


app = QtWidgets.QApplication(sys.argv)
ui = MainUI()
app.exec()
```

1. **`designer/resources.qrc`**

```xml
<!DOCTYPE RCC>
<RCC version="1.0">
    <qresource prefix="icons">
        <file alias="pilars-of-creation.png">pilars-of-creation.png</file>
    </qresource>
</RCC>
```

```bash
$ pyside6-rcc resources.qrc -o resources.py
```

1. **`designer/compiled_example.py`**

```python
# pyside6-uic .\designer\mainwindow.ui -o MainWindow.py
from __future__ import annotations

import random
import sys
from typing import Self

from MainWindow import Ui_MainWindow
from PySide6.QtCore import Qt
from PySide6.QtWidgets import QApplication, QMainWindow, QWidget


class MainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.setupUi(self)
        self.show()

        f = self.label.font()
        f.setPointSize(25)

        self.label.setAlignment(Qt.AlignCenter | Qt.AlignVCenter)
        self.label.setFont(f)

    def update_label(self: Self) -> None:
        n = random.randint(1, 6)
        self.label.setText("%d" % n)


app = QApplication(sys.argv)
w = MainWindow()
app.exec()
```
