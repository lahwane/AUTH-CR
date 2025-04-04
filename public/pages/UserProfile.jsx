const { useState, useRef, useEffect } = React

import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
const { useNavigate } = ReactRouterDOM

export function UserProfile() {
    const user = userService.getLoggedInUser()
    const [bugs, setBugs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/')
            return
        }
        loadUserBugs()
    }, [])

    function loadUserBugs() {
        bugService.query({ userId: user._id })
            .then(res => {
                setBugs(res.bugs)
            })
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('from remove bug', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        if (!severity) return alert('Please enter a severity')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                setBugs(prevBugs =>
                    prevBugs.map(currBug =>
                        currBug._id === savedBug._id ? savedBug : currBug
                    )
                )
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('from edit bug', err)
                showErrorMsg('Cannot update bug')
            })
    }

    if (!user) return null

    return (
        <section className="user-profile main-layout">
            <h1>Hello {user.fullname}</h1>

            {!bugs || (!bugs.length && <h2>No bugs to show</h2>)}
            {bugs && bugs.length > 0 && <h3>Manage your bugs</h3>}
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        </section>
    )
}
