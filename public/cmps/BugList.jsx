import { BugPreview } from './BugPreview.jsx'
const { Link, useNavigate } = ReactRouterDOM

export function BugList({ bugs, onRemoveBug, pageIdx = 0 }) {
    const navigate = useNavigate()

    function isCreator(bug) {
        if (!user) return false
        if (!bug.creator) return true
        return user.isAdmin || bug.creator._id === user._id
    }

    return (
        <section className="bug-list grid cards">
            {bugs.map((bug, idx) => (
                <article className="bug-preview card flex center column" key={bug._id}>
                    <BugPreview idx={bug.createdAt % 9 + 1} bug={bug} />
                    <div className="flex space-between">
                        <Link className="btn" to={`/bug/edit/${bug._id}`}>
                            Edit
                        </Link>
                        <button className="btn" onClick={() => onRemoveBug(bug._id)}>
                            Delete
                        </button>
                        <Link className="btn" to={`/bug/${bug._id}`}>
                            Details
                        </Link>
                    </div>
                </article>
            ))}
        </section>
    )
}
